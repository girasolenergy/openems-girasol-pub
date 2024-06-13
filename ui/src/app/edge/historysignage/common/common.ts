import { CommonEnergyMonitor } from './energy/energy';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonEnergyMonitor,
  ],
  exports: [
    CommonEnergyMonitor,
  ],
})
export class Common { }
