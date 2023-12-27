import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { ChartComponent } from './chart/chart';
import { FlatWidgetComponent } from './flat/flat';
import { FlatWidgetHorizontalLineComponent } from './flat/flat-widget-horizontal-line/flat-widget-horizontal-line';
import { FlatWidgetLineComponent } from './flat/flat-widget-line/flat-widget-line';
import { FlatWidgetPercentagebarComponent } from './flat/flat-widget-percentagebar/flat-widget-percentagebar';
import { HelpButtonComponent } from './modal/help-button/help-button';
import { ModalButtonsComponent } from './modal/modal-button/modal-button';
import { ModalComponent } from './modal/modal';
import { ModalHorizontalLineComponent } from './modal/model-horizontal-line/modal-horizontal-line';
import { ModalInfoLineComponent } from './modal/modal-info-line/modal-info-line';
import { ModalLineComponent } from './modal/modal-line/modal-line';
import { ModalLineItemComponent } from './modal/modal-line/modal-line-item/modal-line-item';
import { ModalPhasesComponent } from './modal/modal-phases/modal-phases';
import { ModalValueLineComponent } from './modal/modal-value-line/modal-value-line';
import { PickDateComponent } from '../pickdate/pickdate.component';
import { PipeModule } from '../pipe/pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        BrowserModule,
        // IonicModule,
        PipeModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule,
    ],
    entryComponents: [
        PickDateComponent,
        FlatWidgetComponent,
        FlatWidgetLineComponent,
        FlatWidgetHorizontalLineComponent,
        FlatWidgetPercentagebarComponent,
        ModalButtonsComponent,
        ModalInfoLineComponent,
        ModalLineComponent,
        ModalHorizontalLineComponent,
        ModalComponent,
        ModalLineItemComponent,
        ModalPhasesComponent,
        ModalValueLineComponent,
    ],
    declarations: [
        PickDateComponent,
        FlatWidgetComponent,
        FlatWidgetLineComponent,
        FlatWidgetHorizontalLineComponent,
        FlatWidgetPercentagebarComponent,
        HelpButtonComponent,
        ModalButtonsComponent,
        ModalInfoLineComponent,
        ModalLineComponent,
        ModalHorizontalLineComponent,
        ModalComponent,
        ChartComponent,
        ModalLineItemComponent,
        ModalPhasesComponent,
        ModalValueLineComponent,
    ],
    exports: [
        FlatWidgetComponent,
        FlatWidgetLineComponent,
        FlatWidgetHorizontalLineComponent,
        FlatWidgetPercentagebarComponent,
        HelpButtonComponent,
        ModalButtonsComponent,
        ModalInfoLineComponent,
        ModalLineComponent,
        ModalHorizontalLineComponent,
        ModalComponent,
        ChartComponent,
        PickDateComponent,
        ModalLineItemComponent,
        ModalPhasesComponent,
        ModalValueLineComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class Generic_ComponentsModule { }
