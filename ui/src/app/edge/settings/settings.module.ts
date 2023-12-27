import { AlertingComponent } from './alerting/alerting.component';
import { AliasUpdateComponent } from './profile/aliasupdate.component';
import { AppModule } from './app/app.module';
import { ChangelogModule } from 'src/app/changelog/changelog.module';
import { ChannelsComponent } from './channels/channels.component';
import { ComponentInstallComponent } from './component/install/install.component';
import { IndexComponent as ComponentInstallIndexComponent } from './component/install/index.component';
import { ComponentUpdateComponent } from './component/update/update.component';
import { IndexComponent as ComponentUpdateIndexComponent } from './component/update/index.component';
import { IonicModule } from '@ionic/angular';
import { NetworkComponent } from './network/network.component';
import { NgModule } from '@angular/core';
import { OeSystemUpdateComponent } from './systemupdate/oe-system-update.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings.component';
import { SharedModule } from './../../shared/shared.module';
import { SystemExecuteComponent } from './systemexecute/systemexecute.component';
import { SystemUpdateComponent } from './systemupdate/systemupdate.component';
@NgModule({
  imports: [
    AppModule,
    SharedModule,
    IonicModule,
    ChangelogModule,
  ],
  declarations: [
    AliasUpdateComponent,
    ChannelsComponent,
    ComponentInstallComponent,
    ComponentInstallIndexComponent,
    ComponentUpdateComponent,
    ComponentUpdateIndexComponent,
    NetworkComponent,
    OeSystemUpdateComponent,
    ProfileComponent,
    SettingsComponent,
    SystemExecuteComponent,
    SystemUpdateComponent,
    AlertingComponent,
  ],
  entryComponents: [],
  exports: [
    OeSystemUpdateComponent,
  ],
})
export class SettingsModule { }
