import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';
import { DayProductionComponent } from './dayproduction/dayproduction';
import { ProductionDayOverviewComponent } from './modal/modal';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
  ],
  entryComponents: [
    DayProductionComponent,
    ProductionDayOverviewComponent,
  ],
  declarations: [
    DayProductionComponent,
    ProductionDayOverviewComponent,
  ],
  exports: [
    DayProductionComponent,
  ],
})
export class Common_DayProduction { }
