import { formatNumber } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { format, isSameDay, isSameMonth, isSameYear } from 'date-fns';
import { saveAs } from 'file-saver-es';
import { Subject } from 'rxjs';
import { QueryHistoricExportXlxsRequest } from 'src/app/shared/jsonrpc/request/queryHistoricExportXlxs';
import { Base64PayloadResponse } from 'src/app/shared/jsonrpc/response/base64PayloadResponse';
import { QueryHistoricTimeseriesEnergyPerPeriodResponse } from 'src/app/shared/jsonrpc/response/queryHistoricTimeseriesEnergyPerPeriodResponse';
import { DefaultTypes } from 'src/app/shared/service/defaulttypes';

import {
  ChannelAddress,
  EdgeConfig,
  Service,
  Utils,
  Websocket,
} from '../../../shared/shared';
import { AbstractHistoryChart } from '../abstracthistorychart';
import {
  calculateResolution,
  ChartOptions,
  Data,
  DEFAULT_TIME_CHART_OPTIONS,
  TooltipItem,
} from './../shared';
import { Buffer } from 'buffer';


@Component({
  selector: 'metersenergy',
  templateUrl: './energy.component.html',
})
export class EnergyComponent
  extends AbstractHistoryChart
  implements OnInit, OnChanges, OnDestroy
{
  private static readonly EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private static readonly EXCEL_EXTENSION = '.xlsx';

  private config: EdgeConfig | null = null;
  private stopOnDestroy: Subject<void> = new Subject<void>();

  public chartType: string;
  public chartData: any[] = [];
  @Input() public period: DefaultTypes.HistoryPeriod;
  @Input() public meters: EdgeConfig.Component[] = [];
  public meterID: string;
  public meterIds: string[] = [];
  public consumptionDatasets = [];
  public productionDatasets = [];

  constructor(
    protected override service: Service,
    protected override translate: TranslateService,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    private websocket: Websocket,
  ) {
    super('energy-chart', service, translate);
  }

  public checkIfToday(): boolean {
    let dateYesterday = this.service.historyPeriod.value.to.getDate();
    let dateToday = new Date().getDate();
    return dateYesterday === dateToday;
  }

  // Export meter consumption to csv file
  public exportToMeterCsv() {
    this.startSpinner();
    this.service.getCurrentEdge().then((edge) => {
      this.service.getConfig().then((config) => {
        this.getEnergyChannelAddresses(config).then((channelAddresses) => {
          let request = new QueryHistoricExportXlxsRequest(
            this.service.historyPeriod.value.from,
            this.service.historyPeriod.value.to,
            channelAddresses,
          );
          edge
            .sendRequest(this.websocket, request)
            .then((response) => {
              let r = response as Base64PayloadResponse;
              let buffer = Buffer.from(
                r.result.payload.replace(/\s/g, ''),
                'base64',
              );
              const data: Blob = new Blob([buffer], {
                type: EnergyComponent.EXCEL_TYPE,
              });
              let fileName = 'Export-' + edge.id + '-';
              let dateFrom = this.service.historyPeriod.value.from;
              let dateTo = this.service.historyPeriod.value.to;
              if (isSameDay(dateFrom, dateTo)) {
                fileName += format(dateFrom, 'dd.MM.yyyy');
              } else if (isSameMonth(dateFrom, dateTo)) {
                fileName +=
                  format(dateFrom, 'dd.') + '-' + format(dateTo, 'dd.MM.yyyy');
              } else if (isSameYear(dateFrom, dateTo)) {
                fileName +=
                  format(dateFrom, 'dd.MM.') +
                  '-' +
                  format(dateTo, 'dd.MM.yyyy');
              } else {
                fileName +=
                  format(dateFrom, 'dd.MM.yyyy') +
                  '-' +
                  format(dateTo, 'dd.MM.yyyy');
              }
              fileName += EnergyComponent.EXCEL_EXTENSION;
              saveAs(data, fileName);
            })
            .catch((reason) => {
              console.warn(reason);
            });
        });
      });
    });
    this.stopSpinner();
  }

  ngOnInit() {
    this.service.setCurrentComponent('', this.route);
    this.startSpinner();
    this.meters.forEach((meter) => {
      this.meterIds.push(meter.id);
    });
  }

  ngOnChanges() {
    this.updateChart();
  }

  ngOnDestroy() {
    this.stopOnDestroy.next();
    this.stopOnDestroy.complete();
    this.unsubscribeChartRefresh();
  }


  protected updateChart() {

    this.service.getCurrentEdge().then((edge) => {
        this.service.getConfig().then((config) => {
            this.config = config;
            this.edge = edge;
            this.loadListChart(config);
          })
          .catch((reason) => {
            console.error(reason); // TODO error message
            this.initializeChart();
            return;
          });
      })
      .catch((reason) => {
        console.error(reason); // TODO error message
        this.initializeChart();
        return;
      });
  }

  private loadListChart(config: EdgeConfig) {
    this.chartType = 'line';

    this.getEnergyChannelAddresses(config).then((channelAddresses) => {
      this.queryHistoricTimeseriesDataMeter(
        this.period.from,
        this.period.to,
        channelAddresses,
      ).then((response) => {
       let result = (
          response as QueryHistoricTimeseriesEnergyPerPeriodResponse
        ).result;
        this.consumptionDatasets = [];
        this.productionDatasets = [];
        this.meterIds?.forEach((meterId) => {
          if (`${meterId}/ActiveConsumptionEnergy` in result.data) {
            let consumptionData = result?.data[`${meterId}/ActiveConsumptionEnergy`].map((value) => {
              return value != null ? value / 1000 : 0; // convert to kWh
            }) || [];
            this.consumptionDatasets.push({ data: consumptionData ?? [] });
          }
          if (`${meterId}/ActiveProductionEnergy` in result?.data) {
            let productionData = result?.data[`${meterId}/ActiveProductionEnergy`]?.map((value) => {
              return value != null ? value / 1000 : 0;
            }) || [];
            this.productionDatasets.push({ data: productionData ?? [] });
          }
        });

        this.loading = false;
        this.stopSpinner();
      }).catch(()=>{
        this.consumptionDatasets = [];
        this.productionDatasets = [];
      });
    });
  }
  public getConsumptionData(index: number): number {
    let data = (this.consumptionDatasets[index]?.data as number[])?.filter((d) => d !== 0);
    return data?.length > 0 ? data[data.length - 1] : 0;
  }
  public getProductionData(index: number): number {
    let data = (this.productionDatasets[index]?.data as number[])?.filter((d) => d !== 0);
    return data?.length > 0 ? data[data.length - 1] : 0;
  }



  private getEnergyChannelAddresses(
    config: EdgeConfig,
  ): Promise<ChannelAddress[]> {
    return new Promise((resolve) => {
      let result: ChannelAddress[] = [];
      this.meterIds.forEach((meterId) => {
        result.push(new ChannelAddress(meterId, 'ActiveConsumptionEnergy'));
        result.push(new ChannelAddress(meterId, 'ActiveProductionEnergy'));
      });
      resolve(result);
      // config.widgets.classes.forEach(clazz => {
      //   switch (clazz.toString()) {
      //     case 'Consumption':

      //       result.push(new ChannelAddress('_sum', 'ConsumptionActiveEnergy'));
      //      //result.push(new ChannelAddress('meter1', 'ActiveConsumptionEnergy'));
      //       break;
      //     case 'Grid':
      //       result.push(new ChannelAddress('_sum', 'GridBuyActiveEnergy'));
      //       result.push(new ChannelAddress('_sum', 'GridSellActiveEnergy'));
      //       break;
      //     case 'Storage':
      //       result.push(new ChannelAddress('_sum', 'EssDcChargeEnergy'))
      //       result.push(new ChannelAddress('_sum', 'EssDcDischargeEnergy'));
      //       break;
      //
      // case 'Common_Production':
      //   result.push(
      //     new ChannelAddress('_sum', 'ProductionActiveEnergy'))
      //   break;
      //   };
      //   return false;
      // });
    });
  }




  protected setLabel() {
    let translate = this.translate;
    let options = <ChartOptions>Utils.deepCopy(DEFAULT_TIME_CHART_OPTIONS);

    // adds second y-axis to chart
    // options.scales.yAxes.push({
    //   id: 'yAxis2',
    //   position: 'right',
    //   scaleLabel: {
    //     display: true,
    //     labelString: "%",
    //     padding: -2,
    //     fontSize: 11
    //   },
    //   gridLines: {
    //     display: false
    //   },
    //   ticks: {
    //     beginAtZero: true,
    //     max: 100,
    //     padding: -5,
    //     stepSize: 20
    //   }
    // })
    options.layout = {
      padding: {
        left: 2,
        right: 2,
        top: 0,
        bottom: 0,
      },
    };

    //x-axis
    options.scales.xAxes[0].time.unit = calculateResolution(
      this.service,
      this.period.from,
      this.period.to,
    ).timeFormat;

    //y-axis
    options.scales.yAxes[0].id = 'yAxis1';
    options.scales.yAxes[0].scaleLabel.labelString = 'kW';
    options.scales.yAxes[0].scaleLabel.padding = -2;
    options.scales.yAxes[0].scaleLabel.fontSize = 11;
    options.scales.yAxes[0].ticks.padding = -5;
    options.tooltips.callbacks.label = function (
      tooltipItem: TooltipItem,
      data: Data,
    ) {
      let label = data.datasets[tooltipItem.datasetIndex].label;
      if (label.split(' ').length > 1) {
        label = label.split(' ').slice(0, 1).toString();
      }

      let value = tooltipItem.yLabel;
      if (label == translate.instant('General.soc').split(' ')[0]) {
        return label + ': ' + formatNumber(value, 'ja', '1.0-0') + ' %';
      } else {
        return label + ': ' + formatNumber(value, 'ja', '1.0-2') + ' kW';
      }
    };
    this.options = options;
  }

  public getChartHeight(): number {
    return this.service.deviceHeight / 2;
  }

}
