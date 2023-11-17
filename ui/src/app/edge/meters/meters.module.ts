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
  //imports：本Module中有些组件是依赖于其他Module中的类的，需要把这些类导入进来。
  imports: [
    // IonicModule,
    CommonModule,
    SharedModule,
    Common_Autarchy,
  ],

  //declarations:那些属于本NgModule的组件，指令，管道。一个模块的所有组件都必须放在该数组中。
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
