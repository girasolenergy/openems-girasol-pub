import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReducedEmissionComponent } from "./reducedgas/reducedgas";
import { SharedModule } from "src/app/shared/shared.module";
// import { ModalComponent } from './modal/modal';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
  ],
  declarations: [
    ReducedEmissionComponent,
    // ModalComponent,
  ],
  exports: [
    ReducedEmissionComponent,
  ],
})
export class ReducedEmissionComponents { }
