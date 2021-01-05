import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [StoreModule.forRoot({}), EffectsModule.forRoot([])],
})
export class SharedRootDataAccessModule {}
