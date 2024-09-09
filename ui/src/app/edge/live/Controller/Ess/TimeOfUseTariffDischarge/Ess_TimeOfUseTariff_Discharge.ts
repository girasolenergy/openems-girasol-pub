import { BrowserModule } from "@angular/platform-browser";
import { FlatComponent } from "./flat/flat";
import { ModalComponent } from "./modal/modal";
import { NgModule } from "@angular/core";
import { ScheduleChartComponent } from "./modal/scheduleChart";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
    ],
    entryComponents: [
        FlatComponent,
        ModalComponent,
        ScheduleChartComponent,
    ],
    declarations: [
        FlatComponent,
        ModalComponent,
        ScheduleChartComponent,
    ],
    exports: [
        FlatComponent,
    ],
})
export class Controller_Ess_TimeOfUseTariff_Discharge { }
