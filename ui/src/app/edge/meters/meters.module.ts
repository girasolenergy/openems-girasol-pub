import { CommonModule } from "@angular/common";
import { EnergyComponent } from "./energy/energy.component";
import { MetersComponent } from "./meters.component";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],

  declarations: [
    MetersComponent,
    EnergyComponent,
  ],
})
export class MetersModule {}
