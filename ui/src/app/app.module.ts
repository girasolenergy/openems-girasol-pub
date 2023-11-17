import {
  APP_INITIALIZER,
  ErrorHandler,
  Injector,
  LOCALE_ID,
  NgModule,
} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LOCATION_INITIALIZED, registerLocaleData } from '@angular/common';
import { Language, MyTranslateLoader } from './shared/type/language';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

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
import { RouteReuseStrategy } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { StatusSingleComponent } from './shared/status/single/status.component';
import { SystemLogComponent } from './edge/settings/systemlog/systemlog.component';
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
  injector: Injector
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
  entryComponents: [ChartOptionsPopoverComponent, PickDatePopoverComponent],
  imports: [
    AngularMyDatePickerModule,
    BrowserAnimationsModule,
    BrowserModule,
    ChangelogModule,
    EdgeModule,
    EdgeSettingsModule,
    IndexModule,
    IonicModule.forRoot(),
    HttpClientModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: MyTranslateLoader },
    }),
    UserModule,
    RegistrationModule,
    AppRoutingModule,
  ],
  providers: [
    //提供服务,通过实现自定义的路由重用策略来满足特定需求。这可以通过实现 RouteReuseStrategy 接口来完成
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    }, //useClass 自动创建新实例,将当前依赖项替换为其他内容的新实例
    CookieService,
    { provide: ErrorHandler, useClass: MyErrorHandler },
    { provide: LOCALE_ID, useValue: Language.DEFAULT.key },
    // // { provide: ErrorHandler, useExisting: Service }, //useExisting 可以复用已有的实例，将当前依赖项替换为现有依赖项
    // {
    //   provide: LOCALE_ID,
    //   useValue: Language.DEFAULT.filename
    // },//useValue 使用静态值,将当前依赖项替换为新值
    // Wait for App till translations are loaded
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true,
    },
    // Use factory for formly. This allows us to use translations in validationMessages.
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerTranslateExtension,
      deps: [TranslateService],
    },

    Pagination,
    CheckForUpdateService,
  ],
  //　bootstrap：应用的主视图，即根组件，它是应用中所有其他视图的宿主。只有根模块才应该设置这个bootstrap属性。Angular创建它并插入index.html宿主页面。
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    //registerLocaleData(localDE);
    registerLocaleData(localJA);
  }
}
