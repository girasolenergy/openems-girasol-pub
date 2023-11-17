import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractHistoryWidget } from 'src/app/edge/history/abstracthistorywidget';
import { Cumulated } from 'src/app/shared/jsonrpc/response/queryHistoricTimeseriesEnergyResponse';
import { DefaultTypes } from 'src/app/shared/service/defaulttypes';
import {
  ChannelAddress,
  Edge,
  EdgeConfig,
  Service,
  Websocket,
  Utils,
} from 'src/app/shared/shared';

@Component({
  selector: ReducedEmissionComponent.SELECTOR,
  templateUrl: './reducedgas.html',
})
export class ReducedEmissionComponent
  extends AbstractHistoryWidget
  implements OnInit, OnChanges, OnDestroy
{
  @Input() public period: DefaultTypes.HistoryPeriod;

  private static readonly SELECTOR = 'ReducedGas';

  public edge: Edge = null;
  public data: Cumulated = null;
  public chargerComponents: EdgeConfig.Component[] = [];
  public productionMeterComponents: EdgeConfig.Component[] = [];
  public readonly CONVERT_WATT_TO_KILOWATT = Utils.CONVERT_WATT_TO_KILOWATT;

  constructor(
    public override service: Service,
    private websocket: Websocket,
    private route: ActivatedRoute
  ) {
    super(service);
  }

  ngOnInit() {
    this.service.setCurrentComponent('', this.route).then((edge) => {
      console.log('co2', edge);
      this.edge = edge;
      edge.subscribeChannels(
        this.websocket,
        ReducedEmissionComponent.SELECTOR,
        [new ChannelAddress('_sum', 'ProductionActiveEnergy')]
      );
    });
  }

  ngOnDestroy() {
    this.unsubscribeWidgetRefresh();
  }

  ngOnChanges() {
    this.updateValues();
  }

  protected updateValues() {
    this.service.getConfig().then((config) => {
      this.getChannelAddresses(this.edge, config).then((channels) => {
        this.service
          .queryEnergy(this.period.from, this.period.to, channels)
          .then((response) => {
            this.data = response.result.data;
          })
          .catch(() => {
            this.data = null;
          });
      });
    });
  }
  public readonly CONVERT_WATT_TO_KG = Utils.CONVERT_WATT_TO_KG;
  protected getChannelAddresses(
    edge: Edge,
    config: EdgeConfig
  ): Promise<ChannelAddress[]> {
    return new Promise((resolve) => {
      let channels: ChannelAddress[] = [
        new ChannelAddress('_sum', 'ProductionActiveEnergy'),
      ];

      this.chargerComponents = config
        .getComponentsImplementingNature(
          'io.openems.edge.ess.dccharger.api.EssDcCharger'
        )
        .filter((component) => component.isEnabled);
      for (let component of this.chargerComponents) {
        channels.push(new ChannelAddress(component.id, 'ActualEnergy'));
      }

      this.productionMeterComponents = config
        .getComponentsImplementingNature(
          'io.openems.edge.meter.api.SymmetricMeter'
        )
        .filter(
          (component) => component.isEnabled && config.isProducer(component)
        );
      for (let component of this.productionMeterComponents) {
        channels.push(
          new ChannelAddress(component.id, 'ActiveProductionEnergy')
        );
      }
      resolve(channels);
    });
  }
}
