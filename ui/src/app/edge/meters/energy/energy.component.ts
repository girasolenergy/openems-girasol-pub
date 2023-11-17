import { formatNumber } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';
import { ChartLegendLabelItem, ChartTooltipItem } from 'chart.js';
import { format, isSameDay, isSameMonth, isSameYear } from 'date-fns';
import { saveAs } from 'file-saver-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QueryHistoricExportXlxsRequest } from 'src/app/shared/jsonrpc/request/queryHistoricExportXlxs';
import { Base64PayloadResponse } from 'src/app/shared/jsonrpc/response/base64PayloadResponse';
import { QueryHistoricTimeseriesEnergyPerPeriodResponse } from 'src/app/shared/jsonrpc/response/queryHistoricTimeseriesEnergyPerPeriodResponse';
import { QueryHistoricTimeseriesEnergyResponse } from 'src/app/shared/jsonrpc/response/queryHistoricTimeseriesEnergyResponse';
import { UnitvaluePipe } from 'src/app/shared/pipe/unitvalue/unitvalue.pipe';
import { DefaultTypes } from 'src/app/shared/service/defaulttypes';

import {
  ChannelAddress,
  Edge,
  EdgeConfig,
  Service,
  Utils,
  Websocket,
} from '../../../shared/shared';
import { AbstractHistoryChart } from '../abstracthistorychart';
import {
  calculateResolution,
  ChartData,
  ChartOptions,
  Data,
  DEFAULT_TIME_CHART_OPTIONS,
  isLabelVisible,
  setLabelVisible,
  TooltipItem,
  Unit,
} from './../shared';
import { Buffer } from 'buffer';
// import { EnergyModalComponent } from './modal/modal.component';

type EnergyChartLabels = {
  production: string;
  gridBuy: string;
  gridSell: string;
  charge: string;
  discharge: string;
  consumption: string;
  directConsumption: string;
  stateOfCharge: string;
};

@Component({
  selector: 'lijingenergy',
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

  public chartType: string = 'bar';
  public chartData: any[] = [];
  @Input() public period: DefaultTypes.HistoryPeriod;

  public meterID: string;
  public meterIds: string[] = [];
  @Input() public meters: EdgeConfig.Component[] = [];
  // @Input() public alias: string;

  ngOnChanges() {
    this.updateChart();
  }

  constructor(
    protected override service: Service,
    protected override translate: TranslateService,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    private websocket: Websocket,
    private unitpipe: UnitvaluePipe,
    private platform: Platform
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
            channelAddresses
          );
          edge
            .sendRequest(this.websocket, request)
            .then((response) => {
              let r = response as Base64PayloadResponse;
              let buffer = Buffer.from(
                r.result.payload.replace(/\s/g, ''),
                'base64'
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
    this.platform.ready().then(() => {
      this.service.isSmartphoneResolutionSubject
        .pipe(takeUntil(this.stopOnDestroy))
        .subscribe((value) => {
          this.updateChart();
        });
    });
    // Timeout is used to prevent ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => this.getChartHeight(), 500);
  }

  ngOnDestroy() {
    this.stopOnDestroy.next();
    this.stopOnDestroy.complete();
    this.unsubscribeChartRefresh();
  }

  /**
   * checks if kWh Chart is allowed to be shown
   */
  private isBarChart(service: Service): boolean {
    let unit = calculateResolution(
      this.service,
      this.period.from,
      this.period.to
    ).resolution.unit;
    if (unit == Unit.MONTHS) {
      return true;
    }
    //unit == Unit.DAYS ||
    return false;
  }

  protected updateChart() {
    this.colors = [];
    this.datasets = [];
    this.loading = true;
    this.startSpinner();
    this.autoSubscribeChartRefresh();

    this.service
      .getCurrentEdge()
      .then((edge) => {
        this.service
          .getConfig()
          .then((config) => {
            this.edge = edge;
            this.config = config;
            this.edge = edge;
            this.datasets = [];

            // Load Linechart or BarChart
            this.generateLabels().then((chartLabels) => {
              if (this.isBarChart(this.service)) {
                this.loadBarChart(chartLabels, config);
              } else {
                this.loadLineChart(config);
              }
            });
          })
          .catch((reason) => {
            console.log('updateChart内部报错前');
            console.error(reason); // TODO error message
            this.initializeChart();
            return;
          });
      })
      .catch((reason) => {
        console.log('updateChart外部报错前');
        console.error(reason); // TODO error message
        this.initializeChart();
        return;
      });
  }

  private loadLineChart(config: EdgeConfig) {
    this.chartType = 'line';

    this.getEnergyChannelAddresses(config).then((channelAddresses) => {
      this.queryHistoricTimeseriesDataMeter(
        this.period.from,
        this.period.to,
        channelAddresses
      ).then((response) => {
        let result = (
          response as QueryHistoricTimeseriesEnergyPerPeriodResponse
        ).result;

        console.log(
          'kankan22line',
          response.result.data,
          response.result.timestamps,
          '111from',
          this.period.from,
          '222to',
          this.period.to,
          '333channel',
          channelAddresses
        );

        // convert labels
        let labels: Date[] = [];
        for (let timestamp of result.timestamps) {
          labels.push(new Date(timestamp));
        }
        this.labels = labels;

        let consumptionDatasets = [];
        let productionDatasets = [];
        // convert datasets
        //let datasets = [];

        // Consumption push data for left y-axis
        this.meterIds.forEach((meterId) => {
          if (`${meterId}/ActiveConsumptionEnergy` in result.data) {
            let consumptionData = result.data[
              `${meterId}/ActiveConsumptionEnergy`
            ].map((value) => {
              if (value == null) {
                return 0;
              } else {
                return value / 1000; // convert to kWh
              }
            });
            consumptionDatasets.push({
              data: consumptionData,
            });
            console.log('消费数组', consumptionDatasets);
          } else if (`${meterId}/ActiveProductionEnergy` in result.data) {
            let productionData = result.data[
              `${meterId}/ActiveProductionEnergy`
            ].map((value) => {
              if (value == null) {
                return 0;
              } else {
                return value / 1000;
              }
            });
            productionDatasets.push({
              data: productionData,
            });
            console.log('生产数组', productionDatasets);
          }
        });

        this.datasets = [...consumptionDatasets, ...productionDatasets];
        this.loading = false;
        this.stopSpinner();
      });
    });
  }
  public getLastNonZeroData(index: number): number {
    let data = (this.datasets[index].data as number[]).filter((d) => d !== 0);
    return data.length > 0 ? data[data.length - 1] : 0;
  }

  private loadBarChart(chartLabels: EnergyChartLabels, config: EdgeConfig) {
    this.chartType = 'bar';
    console.log('kankanbar');

    // debugger
    this.getEnergyChannelAddresses(config).then((channelAddresses) => {
      this.queryHistoricTimeseriesDataMeter(
        this.period.from,
        this.period.to,
        channelAddresses
      )
        .then((response) => {
          let result = (
            response as QueryHistoricTimeseriesEnergyPerPeriodResponse
          ).result;
          //只有选择一整个month时间段时,才能打印出下面
          console.log(
            'bar',
            response.result.data,
            response.result.timestamps,
            '111from',
            this.period.from,
            '222to',
            this.period.to,
            '333channel',
            channelAddresses
          );

          // convert labels
          let labels: Date[] = [];
          for (let timestamp of result.timestamps) {
            labels.push(new Date(timestamp));
          }
          this.labels = labels;

          let barWidthPercentage = 0;
          let categoryGapPercentage = 0;

          switch (this.service.periodString) {
            case 'custom': {
              barWidthPercentage = 0.7;
              categoryGapPercentage = 0.4;
              break;
            }
            case 'week': {
              barWidthPercentage = 0.7;
              categoryGapPercentage = 0.4;
              break;
            }
            case 'month': {
              if (this.service.isSmartphoneResolution == true) {
                barWidthPercentage = 1;
                categoryGapPercentage = 0.6;
              } else {
                barWidthPercentage = 0.9;
                categoryGapPercentage = 0.8;
              }
              break;
            }
            case 'year': {
              if (this.service.isSmartphoneResolution == true) {
                barWidthPercentage = 1;
                categoryGapPercentage = 0.6;
              } else {
                barWidthPercentage = 0.8;
                categoryGapPercentage = 0.8;
              }
              break;
            }
          }

          // convert datasets
          let datasets = [];

          // Consumption push data for left y-axis
          this.meterIds.forEach((meterId) => {
            if (`${meterId}/ActiveConsumptionEnergy` in result.data) {
              let consumptionData = result.data[
                `${meterId}/ActiveConsumptionEnergy`
              ].map((value) => {
                if (value == null) {
                  return 0;
                } else {
                  return value / 1000; // convert to kWh
                }
              });

              datasets.push({
                label: chartLabels.consumption,
                data: consumptionData,
                hidden: !isLabelVisible(chartLabels.consumption),
                backgroundColor: 'rgba(253,197,7,0.25)',
                borderColor: 'rgba(253,197,7,1)',
                hoverBackgroundColor: 'rgba(253,197,7,0.5)',
                hoverBorderColor: 'rgba(253,197,7,1)',
                barPercentage: barWidthPercentage,
                categoryPercentage: categoryGapPercentage,
                stack: 'CONSUMPTION',
              });
              console.log('bar处理后', datasets);
            }
          });
          this.setKwhLabel();
          this.datasets = datasets;
          this.colors = [];
          this.loading = false;
          this.stopSpinner();
        })
        .catch((reason) => {
          console.error(reason); // TODO error message
          this.loadLineChart(config);
        });
    });
  }

  private getEnergyChannelAddresses(
    config: EdgeConfig
  ): Promise<ChannelAddress[]> {
    return new Promise((resolve) => {
      let result: ChannelAddress[] = [];
      this.meterIds.forEach((meterId) => {
        result.push(new ChannelAddress(meterId, 'ActiveConsumptionEnergy'));
        result.push(new ChannelAddress(meterId, 'ActiveProductionEnergy'));
      });

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
      ////影响月度最下面的分类项目上
      // case 'Common_Production':
      //   result.push(
      //     new ChannelAddress('_sum', 'ProductionActiveEnergy'))
      //   break;
      //   };
      //   return false;
      // });
      resolve(result);
    });
  }

  protected getChannelAddresses(
    edge: Edge,
    config: EdgeConfig
  ): Promise<ChannelAddress[]> {
    return new Promise((resolve) => {
      let result: ChannelAddress[] = [];
      config.widgets.classes.forEach((clazz) => {
        switch (clazz.toString()) {
          // case 'Grid':
          //   result.push(new ChannelAddress('_sum', 'GridActivePower'));
          //   break;
          case 'Consumption':
            result.push(new ChannelAddress('_sum', 'ConsumptionActivePower'));
            // result.push(new ChannelAddress('meter1', 'ActiveConsumptionEnergy'));
            break;
          // case 'Storage':
          //   result.push(new ChannelAddress('_sum', 'EssSoc'))
          //   result.push(new ChannelAddress('_sum', 'EssActivePower'));
          //   break;
          // case 'Common_Production':
          //   result.push(
          //     new ChannelAddress('_sum', 'ProductionActivePower'),
          //     new ChannelAddress('_sum', 'ProductionDcActualPower'));
          //   break;
        }
        return false;
      });
      resolve(result);
    });
  }

  private generateLabels(): Promise<EnergyChartLabels> {
    return new Promise((resolve) => {
      // Set regular labels
      let labels: EnergyChartLabels = {
        production: this.translate.instant('General.production'),
        gridBuy: this.translate.instant('General.gridBuy'),
        gridSell: this.translate.instant('General.gridSell'),
        charge: this.translate.instant('General.chargePower'),
        discharge: this.translate.instant('General.dischargePower'),
        consumption: this.translate.instant('General.consumption'),
        directConsumption: this.translate.instant('General.directConsumption'),
        stateOfCharge: this.translate.instant('General.soc'),
      };

      // Generate kWh labels
      this.getEnergyChannelAddresses(this.config).then((channelAddresses) => {
        this.service
          .queryEnergy(this.period.from, this.period.to, channelAddresses)
          .then((response) => {
            let result = (response as QueryHistoricTimeseriesEnergyResponse)
              .result;

            if (
              '_sum/ProductionActiveEnergy' in result.data &&
              response.result.data['_sum/ProductionActiveEnergy'] != null
            ) {
              let kwhProductionValue =
                response.result.data['_sum/ProductionActiveEnergy'];
              labels.production +=
                ' ' +
                this.unitpipe.transform(kwhProductionValue, 'kWh').toString();
            }

            console.log(777, result.data); //只有选择week和month时,_sum/ConsumptionActiveEnergy才能打印出来

            if (
              '_sum/ConsumptionActiveEnergy' in result.data &&
              response.result.data['_sum/ConsumptionActiveEnergy'] != null
            ) {
              let kwhConsumptionValue =
                response.result.data['_sum/ConsumptionActiveEnergy'];
              labels.consumption +=
                ' ' +
                this.unitpipe.transform(kwhConsumptionValue, 'kWh').toString();
              console.log(777888, labels.consumption);
            }

            if (
              '_sum/ProductionActiveEnergy' in result.data &&
              '_sum/EssDcChargeEnergy' in result.data &&
              '_sum/GridSellActiveEnergy' in result.data &&
              response.result.data['_sum/ProductionActiveEnergy'] != null &&
              response.result.data['_sum/EssDcChargeEnergy'] != null &&
              response.result.data['_sum/GridSellActiveEnergy']
            ) {
              let kwhProductionValue =
                response.result.data['_sum/ProductionActiveEnergy'];
              let kwhChargeValue =
                response.result.data['_sum/EssDcChargeEnergy'];
              let kwhGridSellValue =
                response.result.data['_sum/GridSellActiveEnergy'];
              let directConsumptionValue =
                kwhProductionValue - kwhGridSellValue - kwhChargeValue;
              labels.directConsumption +=
                ' ' +
                this.unitpipe
                  .transform(directConsumptionValue, 'kWh')
                  .toString();
            }
            resolve(labels);
          })
          .catch(() => {
            resolve(labels);
          });
      });
    });
  }

  private setKwhLabel() {
    let options = <ChartOptions>Utils.deepCopy(DEFAULT_TIME_CHART_OPTIONS);
    // general
    options.responsive = true;
    options.layout = {
      padding: {
        left: 2,
        right: 0,
        top: 0,
        bottom: 0,
      },
    };

    // X-Axis for Chart: Calculate Time-Unit for normal sized window
    options.scales.xAxes[0].time.unit = calculateResolution(
      this.service,
      this.service.historyPeriod.value.from,
      this.service.historyPeriod.value.to
    ).timeFormat;

    options.scales.xAxes[0].bounds = 'ticks';
    options.scales.xAxes[0].stacked = true;
    options.scales.xAxes[0].offset = true;
    options.scales.xAxes[0].ticks.source = 'data';

    // Y-Axis for Labels
    options.scales.yAxes[0].scaleLabel.labelString = 'kWh';
    options.scales.yAxes[0].scaleLabel.padding = -2;
    options.scales.yAxes[0].scaleLabel.fontSize = 11;

    //  +--------------------------------------------------------------------------------------------------+
    //  | EnergyChartLabels with kWh                                                                       |
    //  +--------------------------------------------------------------------------------------------------|
    //  | Production | GridSell | ChargePower | DirectConsumption | GridBuy | DischargePower | Consumption |
    //  +--------------------------------------------------------------------------------------------------+
    //
    // this.translate is not available in legend methods
    let directConsumptionLabelText = this.translate.instant(
      'General.directConsumption'
    );
    let productionLabelText = this.translate.instant('General.production');
    let consumptionLabelText = this.translate.instant('General.consumption');
    let gridBuyLabelText = this.translate.instant('General.gridBuy');
    let gridSellLabelText = this.translate.instant('General.gridSell');
    let chargeLabelText = this.translate.instant('General.chargePower');
    let dischargeLabelText = this.translate.instant('General.dischargePower');

    options.legend.labels.generateLabels = function (chart: Chart) {
      let chartLegendLabelItems: ChartLegendLabelItem[] = [];
      let chartLegendLabelItemsOrder = [
        productionLabelText,
        gridSellLabelText,
        chargeLabelText,
        directConsumptionLabelText,
        consumptionLabelText,
        gridBuyLabelText,
        dischargeLabelText,
      ];

      // set correct value (label + total kWh) for reorder
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        if (dataset.label.includes(productionLabelText)) {
          chartLegendLabelItemsOrder[0] = dataset.label;
        }
        if (dataset.label.includes(gridSellLabelText)) {
          chartLegendLabelItemsOrder[1] = dataset.label;
        }
        if (dataset.label.includes(chargeLabelText)) {
          chartLegendLabelItemsOrder[2] = dataset.label;
        }
        if (dataset.label.includes(directConsumptionLabelText)) {
          chartLegendLabelItemsOrder[3] = dataset.label;
        }
        if (dataset.label.includes(gridBuyLabelText)) {
          chartLegendLabelItemsOrder[4] = dataset.label;
        }
        if (dataset.label.includes(dischargeLabelText)) {
          chartLegendLabelItemsOrder[5] = dataset.label;
        }
        if (dataset.label.includes(consumptionLabelText)) {
          chartLegendLabelItemsOrder[6] = dataset.label;
        }

        let text = dataset.label;
        let index = datasetIndex;
        let fillStyle = dataset.backgroundColor.toString();

        let lineWidth = 2;
        let strokeStyle = dataset.borderColor.toString();

        if (text.includes(directConsumptionLabelText) && dataset.stack == '1') {
          //skip ChartLegendLabelItem
        } else {
          chartLegendLabelItems.push({
            text: text,
            datasetIndex: index,
            fillStyle: fillStyle,
            // Consumption and Production should always be shown as visible, without line-through style
            hidden: text.includes(consumptionLabelText)
              ? false
              : !chart.isDatasetVisible(datasetIndex),
            lineWidth: lineWidth,
            strokeStyle: strokeStyle,
          });
        }
      });
      chartLegendLabelItems.sort(function (a, b) {
        return (
          chartLegendLabelItemsOrder.indexOf(a.text) -
          chartLegendLabelItemsOrder.indexOf(b.text)
        );
      });
      return chartLegendLabelItems;
    };

    // used to hide both DirectConsumption-legend-Items by clicking one of them
    options.legend.onClick = function (
      event: MouseEvent,
      legendItem: ChartLegendLabelItem
    ) {
      let chart: Chart = this.chart;
      let legendItemIndex = legendItem.datasetIndex;
      let datasets = chart.data.datasets;

      // Set Angulars SessionStorage for Labels to check if they are hidden
      setLabelVisible(
        legendItem.text,
        !chart.isDatasetVisible(legendItemIndex)
      );

      let firstDirectConsumptionStackDatasetIndex: null | number = null;
      let secondDirectConsumptionStackDatasetIndex: null | number = null;

      chart.data.datasets.forEach((value, index) => {
        // seperated stack 0 and 1
        if (
          datasets[index].label.includes(directConsumptionLabelText) &&
          datasets[index].stack == '0'
        ) {
          firstDirectConsumptionStackDatasetIndex = index;
        }
        if (
          datasets[index].label.includes(directConsumptionLabelText) &&
          datasets[index].stack == '1'
        ) {
          secondDirectConsumptionStackDatasetIndex = index;
        }
      });
      datasets.forEach((value, datasetIndex) => {
        let meta = chart.getDatasetMeta(datasetIndex);
        let directConsumptionMetaArr = [
          chart.getDatasetMeta(firstDirectConsumptionStackDatasetIndex),
          chart.getDatasetMeta(secondDirectConsumptionStackDatasetIndex),
        ];

        if (
          legendItemIndex == datasetIndex &&
          (datasetIndex == firstDirectConsumptionStackDatasetIndex ||
            datasetIndex == secondDirectConsumptionStackDatasetIndex)
        ) {
          // hide/show both directConsumption bars
          directConsumptionMetaArr.forEach((meta) => {
            meta.hidden =
              meta.hidden === null
                ? !datasets[firstDirectConsumptionStackDatasetIndex].hidden &&
                  !datasets[secondDirectConsumptionStackDatasetIndex].hidden
                : null;
          });
        } else if (legendItemIndex == datasetIndex) {
          meta.hidden =
            meta.hidden === null ? !datasets[datasetIndex].hidden : null;
        }
      });
      chart.render();
    };
    //
    // Tooltips
    // +-----------------------------------------+
    // |Header |1    Date (Month | Day | Hour)   |
    // |       |                                 |
    // |       |2    Production / Consumption    |
    // |       |                                 |
    // +-------+---------------------------------|
    // |Content|3    EnergyLabels[]              |
    // +-----------------------------------------+

    // 3: EnergyLabels[]
    options.tooltips.mode = 'x';
    //即只显示与鼠标悬停在同一横轴位置的数据

    options.tooltips.callbacks.label = function (
      tooltipItem: TooltipItem,
      data: Data
    ) {
      let value = tooltipItem.value;
      let label = data.datasets[tooltipItem.datasetIndex].label;
      if (isNaN(value) == false) {
        if (label.split(' ').length > 1) {
          label = label.split(' ').slice(0, 1).toString();
        }
        return label + ': ' + formatNumber(value, 'de', '1.0-2') + ' kWh';
      } else {
        return null;
      }
    };
    //当鼠标悬停在数据点上时，根据数据集的不同显示对应的标签和数值。该函数对于柱状图显示的是对应数据的 kWh（千瓦时）数值。

    options.tooltips.itemSort = function (
      a: ChartTooltipItem,
      b: ChartTooltipItem
    ) {
      return b.datasetIndex - a.datasetIndex;
    };
    //通过数据集的索引进行降序排序，

    // 1: Date
    options.tooltips.callbacks.title = (
      tooltipItems: TooltipItem[],
      data: Data
    ): string => {
      let date = new Date(tooltipItems[0].xLabel);
      return this.toTooltipTitle(this.period.from, this.period.to, date);
    };

    // 2: 根据工具提示中显示的数据集的数量和索引来判断是显示Production信息还是Consumption信息
    options.tooltips.callbacks.afterTitle = function (
      item: ChartTooltipItem[],
      data: ChartData
    ) {
      if (item.length == 3) {
        let totalValue = item.reduce(
          (a, e) => a + parseFloat(<string>e.yLabel),
          0
        );
        let isProduction: boolean | null = null;
        item.forEach((item) => {
          if (
            item.datasetIndex == 0 ||
            item.datasetIndex == 1 ||
            item.datasetIndex == 2
          ) {
            isProduction = true;
          } else if (
            item.datasetIndex == 3 ||
            item.datasetIndex == 4 ||
            item.datasetIndex == 5
          ) {
            isProduction = false;
          }
        });
        if (isNaN(totalValue) == false) {
          return isProduction == true
            ? productionLabelText +
                ' ' +
                formatNumber(totalValue, 'de', '1.0-2') +
                ' kWh'
            : consumptionLabelText +
                ' ' +
                formatNumber(totalValue, 'de', '1.0-2') +
                ' kWh';
        }
      } else {
        return null;
      }
    };
    //
    this.options = options;
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
      this.period.to
    ).timeFormat;

    //y-axis
    options.scales.yAxes[0].id = 'yAxis1';
    options.scales.yAxes[0].scaleLabel.labelString = 'kW';
    options.scales.yAxes[0].scaleLabel.padding = -2;
    options.scales.yAxes[0].scaleLabel.fontSize = 11;
    options.scales.yAxes[0].ticks.padding = -5;
    options.tooltips.callbacks.label = function (
      tooltipItem: TooltipItem,
      data: Data
    ) {
      let label = data.datasets[tooltipItem.datasetIndex].label;
      if (label.split(' ').length > 1) {
        label = label.split(' ').slice(0, 1).toString();
      }

      let value = tooltipItem.yLabel;
      if (label == translate.instant('General.soc').split(' ')[0]) {
        return label + ': ' + formatNumber(value, 'de', '1.0-0') + ' %';
      } else {
        return label + ': ' + formatNumber(value, 'de', '1.0-2') + ' kW';
      }
    };
    this.options = options;
  }

  public getChartHeight(): number {
    return this.service.deviceHeight / 2;
  }

  // async presentModal() {
  //   const modal = await this.modalCtrl.create({
  //     component: EnergyModalComponent,
  //   });
  //   return await modal.present();
  // }
}
