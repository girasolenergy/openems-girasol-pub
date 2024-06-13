import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'src/environments';
import { AppModule } from 'src/app/app.module';
import {
  breadcrumbsIntegration,
  browserProfilingIntegration,
  browserTracingIntegration,
  dedupeIntegration,
  defaultStackParser,
  globalHandlersIntegration,
  init,
  linkedErrorsIntegration,
  makeFetchTransport,
  replayIntegration,
} from "@sentry/angular-ivy";

init({
  enabled: environment.enableSentry === true,
  attachStacktrace: true,
  dsn: environment.sentryDsn,
  environment: environment.sentryEnv,
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: [
    browserProfilingIntegration(),
    browserTracingIntegration({
    }),
    globalHandlersIntegration(),
    breadcrumbsIntegration(),
    dedupeIntegration(),
    linkedErrorsIntegration(),
    replayIntegration({
      stickySession: true,
    }),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', /^\//],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  profilesSampleRate: 1.0,
});


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
