import { FormControl, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { Injector, NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartOptionsComponent } from './chartoptions/chartoptions.component';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from './directive/directive';
import { FormlyCheckBoxHyperlinkWrapperComponent } from './formly/form-field-checkbox-hyperlink/form-field-checkbox-hyperlink.wrapper';
import { FormlyFieldCheckboxWithImageComponent } from './formly/formly-field-checkbox-image/formly-field-checkbox-with-image';
import { FormlyFieldModalComponent } from './formly/formly-field-modal/formlyfieldmodal';
import { FormlyFieldRadioWithImageComponent } from './formly/formly-field-radio-with-image/formly-field-radio-with-image';
import { FormlyFieldWithLoadingAnimationComponent } from './formly/formly-skeleton-wrapper';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { FormlySelectFieldExtendedWrapperComponent } from './formly/formly-select-field.extended';
import { FormlySelectFieldModalComponent } from './formly/formly-select-field-modal.component';
import { FormlyWrapperDefaultValueWithCasesComponent } from './formly/form-field-default-cases.wrapper';
import { FormlyWrapperFormFieldComponent } from './formly/form-field.wrapper';
import { FormlyInputSerialNumberWrapperComponent as FormlyWrapperInputSerialNumber } from './formly/input-serial-number-wrapper';
import { Generic_ComponentsModule } from './genericComponents/genericComponents';
import { HeaderComponent } from './header/header.component';
import { HistoryDataErrorComponent } from './history-data-error.component';
import { InputTypeComponent } from './formly/input';
import { IonicModule } from '@ionic/angular';
import { Logger } from './service/logger';
import { MeterModule } from './edge/meter/meter.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { PanelWrapperComponent } from './formly/panel-wrapper.component';
import { PercentageBarComponent } from './percentagebar/percentagebar.component';
import { PipeModule } from './pipe/pipe';
import { RepeatTypeComponent } from './formly/repeat';
import { RouterModule } from '@angular/router';
import { Service } from './service/service';
import { TranslateModule } from '@ngx-translate/core';
import { Utils } from './service/utils';
import { Websocket } from './shared';
import { appRoutingProviders } from './../app-routing.module';

export function IpValidator(control: FormControl): ValidationErrors {
  return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(control.value) ? null : { 'ip': true };
}

export function SubnetmaskValidator(control: FormControl): ValidationErrors {
  return /^(255)\.(0|128|192|224|240|248|252|254|255)\.(0|128|192|224|240|248|252|254|255)\.(0|128|192|224|240|248|252|254|255)/.test(control.value) ? null : { 'subnetmask': true };
}

export function IpValidatorMessage(err, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid IP Address`;
}

export function SubnetmaskValidatorMessage(err, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid Subnetmask`;
}


@NgModule({
  imports: [
    BrowserAnimationsModule,
    ChartsModule,
    CommonModule,
    DirectiveModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule.forRoot({
      type: 'ball-clip-rotate-pulse',
    }),
    ReactiveFormsModule,
    RouterModule,
    FormlyModule.forRoot({
      wrappers: [
        { name: 'form-field', component: FormlyWrapperFormFieldComponent },
        { name: "input-serial-number", component: FormlyWrapperInputSerialNumber },
        { name: 'formly-select-extended-wrapper', component: FormlySelectFieldExtendedWrapperComponent },
        { name: 'formly-field-radio-with-image', component: FormlyFieldRadioWithImageComponent },
        { name: 'form-field-checkbox-hyperlink', component: FormlyCheckBoxHyperlinkWrapperComponent },
        { name: 'formly-wrapper-default-of-cases', component: FormlyWrapperDefaultValueWithCasesComponent },
        { name: 'panel', component: PanelWrapperComponent },
        { name: 'formly-field-modal', component: FormlyFieldModalComponent },
        { name: 'formly-field-checkbox-with-image', component: FormlyFieldCheckboxWithImageComponent },
      ],
      types: [
        { name: 'input', component: InputTypeComponent },
        { name: 'repeat', component: RepeatTypeComponent },
      ],
      validators: [
        { name: 'ip', validation: IpValidator },
        { name: 'subnetmask', validation: SubnetmaskValidator },
      ],
      validationMessages: [
        { name: 'ip', message: IpValidatorMessage },
        { name: 'subnetmask', message: SubnetmaskValidatorMessage },
      ],
    }),
    PipeModule,
    Generic_ComponentsModule,
    TranslateModule,
  ],
  declarations: [
    // components
    ChartOptionsComponent,
    HeaderComponent,
    HistoryDataErrorComponent,
    PercentageBarComponent,
    // formly
    InputTypeComponent,
    FormlyWrapperFormFieldComponent,
    RepeatTypeComponent,
    FormlyWrapperInputSerialNumber,
    FormlySelectFieldExtendedWrapperComponent,
    FormlySelectFieldModalComponent,
    FormlyFieldRadioWithImageComponent,
    FormlyCheckBoxHyperlinkWrapperComponent,
    FormlyWrapperDefaultValueWithCasesComponent,
    FormlyFieldModalComponent,
    PanelWrapperComponent,
    FormlyFieldWithLoadingAnimationComponent,
    FormlyFieldCheckboxWithImageComponent,
  ],
  exports: [
    // modules
    BrowserAnimationsModule,
    ChartsModule,
    CommonModule,
    DirectiveModule,
    FormlyIonicModule,
    FormlyModule,
    FormsModule,
    IonicModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    PipeModule,
    Generic_ComponentsModule,
    MeterModule,
    // components
    ChartOptionsComponent,
    HeaderComponent,
    HistoryDataErrorComponent,
    PercentageBarComponent,
    FormlyFieldWithLoadingAnimationComponent,
  ],
  providers: [
    appRoutingProviders,
    Service,
    Utils,
    Websocket,
    Logger,
  ],
})
export class SharedModule {
  public static injector: Injector;

  constructor(private injector: Injector) {
    SharedModule.injector = injector;
  }
}
