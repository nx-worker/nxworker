import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CheckInDesktopAppModule } from './app/check-in-desktop-app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(CheckInDesktopAppModule)
  .catch(err => console.error(err));
