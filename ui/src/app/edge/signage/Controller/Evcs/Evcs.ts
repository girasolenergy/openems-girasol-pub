import { BrowserModule } from "@angular/platform-browser";
import { FlatComponent } from "./flat/flat";
import { ModalComponent } from "./modal/modal";
import { NgModule } from "@angular/core";
import { PopoverComponent } from "./popover/popover";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
  ],
  declarations: [
    FlatComponent,
    ModalComponent,
    PopoverComponent,
  ],
  exports: [
    FlatComponent,
  ],
})
export class Controller_Evcs { }


