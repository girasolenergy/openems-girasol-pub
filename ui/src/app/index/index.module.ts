import { FilterComponent } from './filter/filter.component';
import { NgModule } from '@angular/core';

import { OverViewComponent } from './overview/overview.component';
import { RegistrationModule } from '../registration/registration.module';
import { SharedModule } from './../shared/shared.module';
import { SumStateComponent } from './shared/sumState';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [SharedModule, RegistrationModule],
  declarations: [
    FilterComponent,
    SumStateComponent,
    LoginComponent,
    OverViewComponent,
  ],
})
export class IndexModule {}
