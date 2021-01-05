import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BookingRootFeatureShellModule } from '@nrwl-airlines/booking/root/feature-shell';

import { environment } from '../environments/environment';
import { BookingMobileAppComponent } from './booking-mobile-app.component';

@NgModule({
  bootstrap: [BookingMobileAppComponent],
  declarations: [BookingMobileAppComponent],
  imports: [
    BrowserModule,
    BookingRootFeatureShellModule,
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    RouterModule,
  ],
})
export class BookingMobileAppModule {}
