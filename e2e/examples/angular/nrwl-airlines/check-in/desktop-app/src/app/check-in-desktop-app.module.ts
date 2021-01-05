import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CheckInRootFeatureShellModule } from '@nrwl-airlines/check-in/root/feature-shell';

import { environment } from '../environments/environment';
import { CheckInDesktopAppComponent } from './check-in-desktop-app.component';

@NgModule({
  bootstrap: [CheckInDesktopAppComponent],
  declarations: [CheckInDesktopAppComponent],
  imports: [
    BrowserModule,
    CheckInRootFeatureShellModule,
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    RouterModule,
  ],
})
export class CheckInDesktopAppModule {}
