import { BrowserModule } from "@angular/platform-browser";
import { LogoComponent } from "./logoview/logoview";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [BrowserModule, SharedModule],
  declarations: [LogoComponent],
  exports: [LogoComponent],
})
export class Common_Logo { }
