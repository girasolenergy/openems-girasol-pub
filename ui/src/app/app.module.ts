import { APP_INITIALIZER, ErrorHandler, Injector, LOCALE_ID, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LOCATION_INITIALIZED, registerLocaleData } from '@angular/common';
import { Language, MyTranslateLoader } from './shared/type/language';
import { RouteReuseStrategy, Router } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ChangelogModule } from './changelog/changelog.module';
import { ChartOptionsPopoverComponent } from './shared/chartoptions/popover/popover.component';
import { CheckForUpdateService } from './appupdateservice';
import { CookieService } from 'ngx-cookie-service';
import { EdgeModule } from './edge/edge.module';
import { SettingsModule as EdgeSettingsModule } from './edge/settings/settings.module';
import { FORMLY_CONFIG } from '@ngx-formly/core';
import { IndexModule } from './index/index.module';
import { MyErrorHandler } from './shared/service/myerrorhandler';
import { Pagination } from './shared/service/pagination';
import { PickDatePopoverComponent } from './shared/pickdate/popover/popover.component';
import { RegistrationModule } from './registration/registration.module';
import { SharedModule } from './shared/shared.module';
import { StatusSingleComponent } from './shared/status/single/status.component';
import { SystemLogComponent } from './edge/settings/systemlog/systemlog.component';
import { TraceService } from '@sentry/angular-ivy';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserModule } from './user/user.module';
import localJA from '@angular/common/locales/ja';
import { registerTranslateExtension } from './shared/translate.extension';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * This method is used to pre-load the translation (using '.use()' method).
 * Forces the application to wait showing to the user till it had translations loaded.
 */
export function appInitializerFactory(
  translate: TranslateService,
  injector: Injector,
) {
  return async () => {
    await injector.get(LOCATION_INITIALIZED, Promise.resolve(null));

    translate.addLangs(translate.getLangs());
    const defaultLang = translate.getDefaultLang();
    translate.setDefaultLang(defaultLang);

    await translate
      .use(Language.DEFAULT.key)
      .toPromise()
      .catch((err) => console.log(err));
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ChartOptionsPopoverComponent,
    PickDatePopoverComponent,
    StatusSingleComponent,
    SystemLogComponent,
  ],
  entryComponents: [
    ChartOptionsPopoverComponent,
    PickDatePopoverComponent,
  ],
  imports: [
    AngularMyDatePickerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ChangelogModule,
    EdgeModule,
    EdgeSettingsModule,
    IndexModule,
    IonicModule.forRoot(),
    HttpClientModule,
    SharedModule,
    TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: MyTranslateLoader } }),
    UserModule,
    RegistrationModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    CookieService,
    { provide: ErrorHandler, useClass: MyErrorHandler },
    { provide: LOCALE_ID, useValue: Language.DEFAULT.key },
    //  { provide: ErrorHandler, useExisting: Service },
    // {
    //   provide: LOCALE_ID,
    //   useValue: Language.DEFAULT.filename
    // },
    // Wait for App till translations are loaded
    // {
    //   provide: ErrorHandler,
    //   useValue: createErrorHandler({
    //     showDialog: true,
    //   }),
    // },
    {
      provide: TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector, TraceService],
      multi: true,
    },
    // Use factory for formly. This allows us to use translations in validationMessages.
    { provide: FORMLY_CONFIG, multi: true, useFactory: registerTranslateExtension, deps: [TranslateService] },
    Pagination,
    CheckForUpdateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    //registerLocaleData(localDE);
    registerLocaleData(localJA);
  }
}
