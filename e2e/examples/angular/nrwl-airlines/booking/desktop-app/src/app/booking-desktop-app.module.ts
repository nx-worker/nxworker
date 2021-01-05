import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BookingRootFeatureShellModule } from '@nrwl-airlines/booking/root/feature-shell';

import { environment } from '../environments/environment';
import { BookingDesktopAppComponent } from './booking-desktop-app.component';

@NgModule({
  bootstrap: [BookingDesktopAppComponent],
  declarations: [BookingDesktopAppComponent],
  imports: [
    BrowserModule,
    BookingRootFeatureShellModule,
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    RouterModule,
  ],
})
export class BookingDesktopAppModule {}
