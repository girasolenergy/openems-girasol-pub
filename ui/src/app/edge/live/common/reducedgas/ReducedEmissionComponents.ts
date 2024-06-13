import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReducedEmissionComponent } from './reducedgas/reducedgas';
// import { ModalComponent } from './modal/modal';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
  ],
  entryComponents: [
    ReducedEmissionComponent,
    // ModalComponent,
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
