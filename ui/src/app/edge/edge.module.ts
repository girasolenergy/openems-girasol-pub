import { HistoryModule } from './history/history.module';
import { LiveModule } from './live/live.module';
import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { MetersModule } from './meters/meters.module';
import { IonicModule } from '@ionic/angular';
import { EdgeComponent } from './edge.component';

@NgModule({
  declarations: [
    EdgeComponent
  ],
  imports: [
    HistoryModule,
    LiveModule,
    MetersModule,
    SharedModule,
    IonicModule
  ],
  exports: [
    EdgeComponent
  ]
})
export class EdgeModule { }
