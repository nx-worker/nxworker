import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CheckInMobileAppModule } from './app/check-in-mobile-app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(CheckInMobileAppModule)
  .catch(err => console.error(err));
