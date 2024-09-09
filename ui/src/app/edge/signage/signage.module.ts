import { AdministrationComponent } from "./Controller/Evcs/administration/administration.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { Common_Autarchy } from "./common/autarchy/Common_Autarchy";
import { Common_Consumption } from "./common/consumption/Common_Consumption";
import { Common_DayProduction } from "./common/dayproduction/Common_DayProduction";
import { Common_Logo } from "./common/logo/Common_Logo";
import { Common_Logos } from "./common/logos/Common_Logos";
import { Common_Production } from "./common/production/Common_Production";
import { Common_Sensor } from "./common/sensor/Common_Sensor";
import { Controller_Asymmetric_PeakShavingComponent } from "./Controller/PeakShaving/Asymmetric/Asymmetric";
import { Controller_Asymmetric_PeakShavingModalComponent } from "./Controller/PeakShaving/Asymmetric/modal/modal.component";
import { Controller_Evcs } from "./Controller/Evcs/Evcs";
import { Controller_Symmetric_PeakShavingComponent } from "./Controller/PeakShaving/Symmetric/Symmetric";
import { Controller_Symmetric_PeakShavingModalComponent } from "./Controller/PeakShaving/Symmetric/modal/modal.component";
import { Controller_Symmetric_TimeSlot_PeakShavingComponent } from "./Controller/PeakShaving/Symmetric_TimeSlot/Symmetric_TimeSlot";
import { Controller_Symmetric_TimeSlot_PeakShavingModalComponent } from "./Controller/PeakShaving/Symmetric_TimeSlot/modal/modal.component";
import { CurMonthProductionComponent } from "./common/curmonthproduction/curmonthproduction.component";
import { EnergymonitorModule } from "./energymonitor/energymonitor.module";
import { EvcsChartComponent } from "./Multiple/Evcs_Api_Cluster/modal/evcs-chart/evcs.chart";
import { InfoComponent } from "./info/info.component";
import { NgModule } from "@angular/core";
import { OfflineComponent } from "./offline/offline.component";
import { PreMonthProductionComponent } from "./common/premonthproduction/premonthproduction.component";
import { ReducedEmissionComponents } from "./common/reducedgas/ReducedEmissionComponents";
import { SharedModule } from "../../shared/shared.module";
import { SignageComponent } from "./signage.component";
import { StorageComponent } from "./common/storage/storage.component";
import { StorageModalComponent } from "./common/storage/modal/modal.component";
import { YearProductionComponent } from "./common/yearproduction/yearproduction.component";
import { YearReducedgasComponent } from "./common/yearreducedgas/yearreducedgas.component";
@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    // Common
    Common_Autarchy,
    Common_Production,
    Common_DayProduction,
    Common_Sensor,
    Common_Logo,
    Common_Logos,
    ReducedEmissionComponents,
    Common_Consumption,
    EnergymonitorModule,
    SharedModule,
    Controller_Evcs,
  ],
  declarations: [
    AdministrationComponent,
    Controller_Asymmetric_PeakShavingComponent,
    Controller_Asymmetric_PeakShavingModalComponent,
    Controller_Symmetric_PeakShavingComponent,
    Controller_Symmetric_PeakShavingModalComponent,
    Controller_Symmetric_TimeSlot_PeakShavingComponent,
    Controller_Symmetric_TimeSlot_PeakShavingModalComponent,
    EvcsChartComponent,
    InfoComponent,
    SignageComponent,
    OfflineComponent,
    CurMonthProductionComponent,
    PreMonthProductionComponent,
    YearProductionComponent,
    YearReducedgasComponent,
    StorageComponent,
    StorageModalComponent,
  ],
})
export class SignageModule { }
