import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'src/environments';
import { AppModule } from 'src/app/app.module';
import {
  Breadcrumbs,
  BrowserClient,
  BrowserProfilingIntegration,
  BrowserTracing,
  Dedupe,
  defaultStackParser,
  getCurrentHub,
  GlobalHandlers,
  LinkedErrors,
  makeFetchTransport,
  Replay,
  routingInstrumentation,
} from "@sentry/angular-ivy";

const client = new BrowserClient({
  enabled: environment.enableSentry === true,
  attachStacktrace: true,
  dsn: environment.sentryDsn,
  environment: environment.sentryEnv,
  release: 'openems-ui@1.0.0',
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: [
    new BrowserProfilingIntegration(),
    new BrowserTracing({
      tracePropagationTargets: ['localhost', /^\//],
      routingInstrumentation: routingInstrumentation,
    }),
    new GlobalHandlers(),
    new Breadcrumbs(),
    new Dedupe(),
    new LinkedErrors(),
    new Replay({
      stickySession: true,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
getCurrentHub().bindClient(client);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
