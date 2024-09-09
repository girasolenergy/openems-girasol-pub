import { registerLocaleData } from "@angular/common";
import localJA from "@angular/common/locales/ja";
import localeJaExtra from "@angular/common/locales/extra/ja";
import { LOCALE_ID } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FORMLY_CONFIG } from "@ngx-formly/core";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { Service } from "src/app/shared/shared";
import { registerTranslateExtension } from "src/app/shared/translate.extension";
import { Language, MyTranslateLoader } from "src/app/shared/type/language";

export type TestContext = { translate: TranslateService, service: Service };

export async function sharedSetup(): Promise<TestContext> {
  await TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: MyTranslateLoader }, defaultLanguage: Language.DEFAULT.key, useDefaultLang: false }),
    ],
    providers: [
      TranslateService,
      { provide: FORMLY_CONFIG, multi: true, useFactory: registerTranslateExtension, deps: [TranslateService] },
      { provide: LOCALE_ID, useValue: Language.DEFAULT.key },
      Service,
    ],
  }).compileComponents().then(() => {
    const translateService = TestBed.inject(TranslateService);
    translateService.addLangs(["en", "de", "ja"]);
    translateService.use("ja");
    registerLocaleData(localJA, "ja", localeJaExtra);
  });

  return {
    translate: TestBed.inject(TranslateService),
    service: TestBed.inject(Service),
  };
}

export function removeFunctions(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const result: any = {};
  for (const key in obj) {
    if (typeof obj[key] !== "function") {
      result[key] = removeFunctions(obj[key]);
    }
  }
  return result;
}
