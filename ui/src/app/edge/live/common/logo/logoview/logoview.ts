import { ChannelAddress, EdgeConfig, Utils } from "src/app/shared/shared";

import { AbstractFlatWidget } from "src/app/shared/genericComponents/flat/abstract-flat-widget";
import { Component } from "@angular/core";

@Component({
  selector: "LogoView",
  templateUrl: "./logoview.html",
})
export  class LogoComponent extends AbstractFlatWidget {
  public readonly CONVERT_TO_DEGREES = Utils.CONVERT_TO_DEGREES;
  public readonly CONVERT_TO_LUX = Utils.CONVERT_TO_LUX;
  public channelAddress;
  public channelAddress1;
  public channelAddress2: number = 1;
  public sensors: EdgeConfig.Component[] = [];
  public chargerComponents: EdgeConfig.Component[] = [];
  public productionMeterComponents: EdgeConfig.Component[] = [];

  protected override getChannelAddresses() {
    // Get Chargers
    this.chargerComponents = this.config
      .getComponentsImplementingNature(
        "io.openems.edge.ess.dccharger.api.EssDcCharger",
      )
      .filter((component) => component.isEnabled);

    // Get productionMeters
    this.productionMeterComponents = this.config
      .getComponentsImplementingNature(
        "io.openems.edge.meter.api.ElectricityMeter",
      )
      .filter(
        (component) => component.isEnabled && this.config.isProducer(component),
      );
    return [
      (this.channelAddress = new ChannelAddress(
        "pvInverter0",
        "Alarm_D1_Custom_Alarm",
      )),
      (this.channelAddress1 = new ChannelAddress(
        "pvInverter0",
        "Alarm_D2_Custom_Alarm",
      )),
    ];
  }
}
