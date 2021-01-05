import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CheckInRootFeatureShellModule } from '@nrwl-airlines/check-in/root/feature-shell';

import { environment } from '../environments/environment';
import { CheckInMobileAppComponent } from './check-in-mobile-app.component';

@NgModule({
  bootstrap: [CheckInMobileAppComponent],
  declarations: [CheckInMobileAppComponent],
  imports: [
    BrowserModule,
    CheckInRootFeatureShellModule,
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    RouterModule,
  ],
})
export class CheckInMobileAppModule {}
