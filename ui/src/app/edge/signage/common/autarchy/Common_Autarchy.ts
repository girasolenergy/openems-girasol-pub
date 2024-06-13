import { BrowserModule } from '@angular/platform-browser';
import { FlatComponent } from './flat/flat';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
  ],
  entryComponents: [
    FlatComponent,
  ],
  declarations: [
    FlatComponent,
  ],
  exports: [
    FlatComponent,
  ],
})
export class Common_Autarchy { }
