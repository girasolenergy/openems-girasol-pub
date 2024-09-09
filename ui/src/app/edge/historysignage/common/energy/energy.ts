import { BrowserModule } from "@angular/platform-browser";
import { ChartComponent } from "./chart/chart";
import { FlatComponent } from "./flat/flat";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
  ],
  declarations: [
    FlatComponent,
    ChartComponent,
  ],
  exports: [
    FlatComponent,
  ],
})
export class CommonEnergyMonitor { }
