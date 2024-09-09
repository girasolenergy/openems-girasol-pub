import { EdgeComponent } from "./edge.component";
import { HistoryModule } from "./history/history.module";
import { HistorySignageModule } from "./historysignage/historysignage.module";
import { IonicModule } from "@ionic/angular";
import { LiveModule } from "./live/live.module";
import { MetersModule } from "./meters/meters.module";
import { NgModule } from "@angular/core";
import { SharedModule } from "./../shared/shared.module";
import { SignageModule } from "./signage/signage.module";

@NgModule({
  declarations: [
    EdgeComponent,
  ],
  imports: [
    HistoryModule,
    LiveModule,
    SignageModule,
    HistorySignageModule,
    MetersModule,
    SharedModule,
    IonicModule,
  ],
  exports: [
    EdgeComponent,
  ],
})
export class EdgeModule { }
