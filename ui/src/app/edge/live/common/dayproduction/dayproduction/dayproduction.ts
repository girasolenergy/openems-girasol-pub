import { Component } from '@angular/core';

import { AbstractFlatWidget } from 'src/app/shared/genericComponents/flat/abstract-flat-widget';
import { Cumulated } from 'src/app/shared/jsonrpc/response/queryHistoricTimeseriesEnergyResponse';

import { EdgeConfig, Utils } from 'src/app/shared/shared';

@Component({
  selector: 'DayProduction',
  templateUrl: './dayproduction.html',
})
export class DayProductionComponent extends AbstractFlatWidget {
  public data: Cumulated = null;
  public chargerComponents: EdgeConfig.Component[] = [];
  public productionMeterComponents: EdgeConfig.Component[] = [];

  public readonly CONVERT_TO_KILO_WATTHOURS = Utils.CONVERT_TO_KILO_WATTHOURS;

  public readonly CONVERT_WATT_TO_KILOWATT = Utils.CONVERT_WATT_TO_KILOWATT;

  protected override getChannelAddresses() {
    // Get Chargers
    this.chargerComponents = this.config
      .getComponentsImplementingNature(
        'io.openems.edge.ess.dccharger.api.EssDcCharger'
      )
      .filter((component) => component.isEnabled);

    // Get productionMeters
    this.productionMeterComponents = this.config
      .getComponentsImplementingNature(
        'io.openems.edge.meter.api.ElectricityMeter'
      )
      .filter(
        (component) => component.isEnabled && this.config.isProducer(component)
      );

    return [];
  }
}
