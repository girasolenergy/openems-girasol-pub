import { BrowserModule } from '@angular/platform-browser';
import { DayProductionComponent } from './dayproduction/dayproduction';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
  ],
  entryComponents: [
    DayProductionComponent,
  ],
  declarations: [
    DayProductionComponent,
  ],
  exports: [
    DayProductionComponent,
  ],
})
export class Common_DayProduction { }
