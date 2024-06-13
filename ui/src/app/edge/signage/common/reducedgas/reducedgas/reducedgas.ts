import { Component, Input } from '@angular/core';
import {
  EdgeConfig,
  Utils,
} from 'src/app/shared/shared';

import { AbstractFlatWidget } from 'src/app/shared/genericComponents/flat/abstract-flat-widget';
import { Cumulated } from 'src/app/shared/jsonrpc/response/queryHistoricTimeseriesEnergyResponse';
import { DefaultTypes } from 'src/app/shared/service/defaulttypes';

@Component({
  selector: 'ReducedGas',
  templateUrl: './reducedgas.html',
})
export class ReducedEmissionComponent extends AbstractFlatWidget
{
  @Input() public period: DefaultTypes.HistoryPeriod;

  public data: Cumulated = null;
  public chargerComponents: EdgeConfig.Component[] = [];
  public productionMeterComponents: EdgeConfig.Component[] = [];
  public readonly CONVERT_WATT_TO_KILOWATT = Utils.CONVERT_WATT_TO_KILOWATT;
  public readonly CONVERT_WATT_TO_KG = Utils.CONVERT_WATT_TO_KG;
}
