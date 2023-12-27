import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SensorComponent } from './sensorview/sensorview';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
  ],
  entryComponents: [
    SensorComponent,
  ],
  declarations: [
    SensorComponent,
  ],
  exports: [
    SensorComponent,
  ],
})
export class Common_Sensor { }
