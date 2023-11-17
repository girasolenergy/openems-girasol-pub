import { ChannelAddress, EdgeConfig, Utils } from 'src/app/shared/shared';

import { AbstractFlatWidget } from 'src/app/shared/genericComponents/flat/abstract-flat-widget';
import { Component } from '@angular/core';

@Component({
    selector: "SensorView",
    templateUrl: './sensorview.html'
})

export class SensorComponent extends AbstractFlatWidget {


    public readonly CONVERT_TO_DEGREES = Utils.CONVERT_TO_DEGREES;
    public readonly CONVERT_TO_LUX = Utils.CONVERT_TO_LUX;
    public sensors: EdgeConfig.Component[] = [];

    ionViewWillEnter() {
      console.log(666,ChannelAddress);
    }
}

