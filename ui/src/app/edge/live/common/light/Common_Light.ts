import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LightComponent } from './lightview/lightview';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [BrowserModule, SharedModule],
  entryComponents: [LightComponent],
  declarations: [LightComponent],
  exports: [LightComponent],
})
export class Common_Light {}
