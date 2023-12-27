import { CommonModule } from '@angular/common';
import { Common_Autarchy } from '../history/common/autarchy/Autarchy';
import { ConsumptionChartOverviewComponent } from './consumption/consumptionchartoverview/consumptionchartoverview.component';
import { ConsumptionComponent } from './consumption/widget.component';
import { ConsumptionEvcsChartComponent } from './consumption/evcschart.component';
import { ConsumptionMeterChartComponent } from './consumption/meterchart.component';
import { ConsumptionOtherChartComponent } from './consumption/otherchart.component';
import { ConsumptionSingleChartComponent } from './consumption/singlechart.component';
import { ConsumptionTotalChartComponent } from './consumption/totalchart.component';
// import { IonicModule } from '@ionic/angular';
import { EnergyComponent } from './energy/energy.component';
import { MetersComponent } from './meters.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    // IonicModule,
    CommonModule,
    SharedModule,
    Common_Autarchy,
  ],

  declarations: [
    MetersComponent,
    ConsumptionChartOverviewComponent,
    ConsumptionComponent,
    ConsumptionEvcsChartComponent,
    ConsumptionMeterChartComponent,
    ConsumptionOtherChartComponent,
    ConsumptionSingleChartComponent,
    ConsumptionTotalChartComponent,
    EnergyComponent,
  ],
  // entryComponents: [
  //   EnergyModalComponent,
  // ],
})
export class MetersModule {}
