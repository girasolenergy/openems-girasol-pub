import { Common } from './common/common';
import { HistorySignageComponent } from './historysignage.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    Common,
  ],
  declarations: [
    HistorySignageComponent,
  ],
})
export class HistorySignageModule { }
