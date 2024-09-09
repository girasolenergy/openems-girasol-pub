import { BrowserModule } from "@angular/platform-browser";
import { LogosComponent } from "./logoview/logosview";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [BrowserModule, SharedModule],
  declarations: [LogosComponent],
  exports: [LogosComponent],
})
export class Common_Logos {}
