import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AliasUpdateComponent } from './edge/settings/profile/aliasupdate.component';
import { AsymmetricPeakshavingChartOverviewComponent } from './edge/history/peakshaving/asymmetric/asymmetricpeakshavingchartoverview/asymmetricpeakshavingchartoverview.component';
import { OverviewComponent as AutarchyChartOverviewComponent } from './edge/history/common/autarchy/overview/overview';
import { ChangelogViewComponent } from './changelog/view/view';
import { OverviewComponent as ChannelthresholdChartOverviewComponent } from './edge/history/Controller/ChannelThreshold/overview/overview';
import { OverviewComponent as ConsumptionChartOverviewComponent } from './edge/history/common/consumption/overview/overview';
import { DataService } from './shared/genericComponents/shared/dataservice';
import { DelayedSellToGridChartOverviewComponent } from './edge/history/delayedselltogrid/symmetricpeakshavingchartoverview/delayedselltogridchartoverview.component';
import { EdgeComponent } from './edge/edge.component';
import { HistoryComponent as EdgeHistoryComponent } from './edge/history/history.component';
import { HistorySignageComponent as EdgeHistorySignageComponent } from './edge/historysignage/historysignage.component';
import { LiveComponent as EdgeLiveComponent } from './edge/live/live.component';
import { MetersComponent as EdgeMeterComponent } from './edge/meters/meters.component';
import { AlertingComponent as EdgeSettingsAlerting } from './edge/settings/alerting/alerting.component';
import { IndexComponent as EdgeSettingsAppIndex } from './edge/settings/app/index.component';
import { SingleAppComponent as EdgeSettingsAppSingle } from './edge/settings/app/single.component';
import { UpdateAppComponent as EdgeSettingsAppUpdate } from './edge/settings/app/update.component';
import { ChannelsComponent as EdgeSettingsChannelsComponent } from './edge/settings/channels/channels.component';
import { SettingsComponent as EdgeSettingsComponent } from './edge/settings/settings.component';
import { ComponentInstallComponent as EdgeSettingsComponentInstallComponentComponent } from './edge/settings/component/install/install.component';
import { IndexComponent as EdgeSettingsComponentInstallIndexComponentComponent } from './edge/settings/component/install/index.component';
import { ComponentUpdateComponent as EdgeSettingsComponentUpdateComponentComponent } from './edge/settings/component/update/update.component';
import { IndexComponent as EdgeSettingsComponentUpdateIndexComponentComponent } from './edge/settings/component/update/index.component';
import { NetworkComponent as EdgeSettingsNetworkComponent } from './edge/settings/network/network.component';
import { ProfileComponent as EdgeSettingsProfileComponent } from './edge/settings/profile/profile.component';
import { SystemExecuteComponent as EdgeSettingsSystemExecuteComponent } from './edge/settings/systemexecute/systemexecute.component';
import { SystemLogComponent as EdgeSettingsSystemLogComponent } from './edge/settings/systemlog/systemlog.component';
import { SystemUpdateComponent as EdgeSettingsSystemUpdateComponent } from './edge/settings/systemupdate/systemupdate.component';
import { SignageComponent as EdgeSignageComponent } from './edge/signage/signage.component';
import { FixDigitalOutputChartOverviewComponent } from './edge/history/fixdigitaloutput/fixdigitaloutputchartoverview/fixdigitaloutputchartoverview.component';
import { OverviewComponent as GridChartOverviewComponent } from './edge/history/common/grid/overview/overview';
import { GridOptimizedChargeChartOverviewComponent } from './edge/history/gridoptimizedcharge/gridoptimizedchargechartoverview/gridoptimizedchargechartoverview.component';
import { HeatPumpChartOverviewComponent } from './edge/history/heatpump/heatpumpchartoverview/heatpumpchartoverview.component';
import { HeatingelementChartOverviewComponent } from './edge/history/heatingelement/heatingelementchartoverview/heatingelementchartoverview.component';
import { HistoryDataService } from './edge/history/historydataservice';
import { HistoryParentComponent } from './edge/history/historyparent.component';
import { LiveDataService } from './edge/live/livedataservice';
import { LoginComponent } from './index/login.component';
import { NgModule } from '@angular/core';
import { OverViewComponent } from './index/overview/overview.component';
import { OverviewComponent as ProductionChartOverviewComponent } from './edge/history/common/production/overview/overview';
import { OverviewComponent as SelfconsumptionChartOverviewComponent } from './edge/history/common/selfconsumption/overview/overview';
import { SignageDataService } from './edge/signage/signagedataservice';
import { SinglethresholdChartOverviewComponent } from './edge/history/singlethreshold/singlethresholdchartoverview/singlethresholdchartoverview.component';
import { StorageChartOverviewComponent } from './edge/history/storage/storagechartoverview/storagechartoverview.component';
import { SymmetricPeakshavingChartOverviewComponent } from './edge/history/peakshaving/symmetric/symmetricpeakshavingchartoverview/symmetricpeakshavingchartoverview.component';
import { OverviewComponent as TimeOfUseTariffOverviewComponent } from './edge/history/Controller/Ess/TimeOfUseTariff/overview/overview';
import { TimeslotPeakshavingChartOverviewComponent } from './edge/history/peakshaving/timeslot/timeslotpeakshavingchartoverview/timeslotpeakshavingchartoverview.component';
import { UserComponent } from './user/user.component';
import { environment } from 'src/environments';

const routes: Routes = [

  // TODO should be removed in the future
  { path: 'index', redirectTo: 'login', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { navbarTitle: environment.uiTitle } },

  { path: 'overview', component: OverViewComponent },

  { path: 'user', component: UserComponent },
  { path: 'changelog', component: ChangelogViewComponent },

  // Edge Pages
  // {
  //   path: 'device/:edgeId',
  //   redirectTo: 'device/:edgeId/live',
  //   pathMatch: 'full',
  // },
  //{ path: 'device/:edgeId/live', component: EdgeLiveComponent },
  {
    path: 'device/:edgeId', component: EdgeComponent, children: [
      { path: '', redirectTo: 'live', pathMatch: 'full' },
      {
        path: 'live', data: { navbarTitle: environment.uiTitle }, providers: [{
          useClass: LiveDataService,
          provide: DataService,
        }], component: EdgeLiveComponent,
      },

      { path: 'meters', component: EdgeMeterComponent },
      { path: 'signage',  data: { navbarTitle: environment.uiTitle },providers: [
        { useClass: SignageDataService,
          provide: DataService,
        }], component: EdgeSignageComponent,
      },
      { path: 'historysignage', providers: [{
        useClass: HistoryDataService,
        provide: DataService,
      }],component: EdgeHistorySignageComponent },
      {
        path: 'history', providers: [{
          useClass: HistoryDataService,
          provide: DataService,
        }], component: HistoryParentComponent, children: [
          { path: '', component: EdgeHistoryComponent },
          // History Chart Pages
          { path: ':componentId/asymmetricpeakshavingchart', component: AsymmetricPeakshavingChartOverviewComponent },
          { path: ':componentId/delayedselltogridchart', component: DelayedSellToGridChartOverviewComponent },
          { path: ':componentId/fixdigitaloutputchart', component: FixDigitalOutputChartOverviewComponent },
          { path: ':componentId/gridOptimizedChargeChart', component: GridOptimizedChargeChartOverviewComponent },
          { path: ':componentId/heatingelementchart', component: HeatingelementChartOverviewComponent },
          { path: ':componentId/heatpumpchart', component: HeatPumpChartOverviewComponent },
          { path: ':componentId/scheduleChart', component: TimeOfUseTariffOverviewComponent },
          { path: ':componentId/singlethresholdchart', component: SinglethresholdChartOverviewComponent },
          { path: ':componentId/symmetricpeakshavingchart', component: SymmetricPeakshavingChartOverviewComponent },
          { path: ':componentId/timeslotpeakshavingchart', component: TimeslotPeakshavingChartOverviewComponent },
          { path: 'autarchychart', component: AutarchyChartOverviewComponent },
          { path: 'consumptionchart', component: ConsumptionChartOverviewComponent },
          { path: 'gridchart', component: GridChartOverviewComponent },
          { path: 'productionchart', component: ProductionChartOverviewComponent },
          { path: 'selfconsumptionchart', component: SelfconsumptionChartOverviewComponent },
          { path: 'storagechart', component: StorageChartOverviewComponent },

          // Controllers
          { path: 'channelthresholdchart', component: ChannelthresholdChartOverviewComponent },
        ],
      },

      { path: 'settings', data: { navbarTitleToBeTranslated: 'Menu.edgeSettings' }, component: EdgeSettingsComponent },
      { path: 'settings/channels', component: EdgeSettingsChannelsComponent },
      { path: 'settings/component.install', component: EdgeSettingsComponentInstallIndexComponentComponent },
      { path: 'settings/component.install/:factoryId', component: EdgeSettingsComponentInstallComponentComponent },
      { path: 'settings/component.update', component: EdgeSettingsComponentUpdateIndexComponentComponent },
      { path: 'settings/component.update/:componentId', component: EdgeSettingsComponentUpdateComponentComponent },
      { path: 'settings/network', component: EdgeSettingsNetworkComponent },
      { path: 'settings/profile', component: EdgeSettingsProfileComponent },
      { path: 'settings/profile/:componentId', component: AliasUpdateComponent },
      { path: 'settings/systemexecute', component: EdgeSettingsSystemExecuteComponent },
      { path: 'settings/systemlog', component: EdgeSettingsSystemLogComponent },
      { path: 'settings/systemupdate', component: EdgeSettingsSystemUpdateComponent },
      { path: 'settings/app', data: { navbarTitle: environment.edgeShortName + ' Apps' }, component: EdgeSettingsAppIndex },
      { path: 'settings/app/update/:appId', component: EdgeSettingsAppUpdate },
      { path: 'settings/app/single/:appId', component: EdgeSettingsAppSingle },
      { path: 'settings/alerting', component: EdgeSettingsAlerting },
    ],
  },

  { path: 'demo', component: LoginComponent },
  // Fallback
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

export const appRoutingProviders: any[] = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
