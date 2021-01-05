import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SeatmapEffects } from './+state/seatmap.effects';
import * as fromSeatmap from './+state/seatmap.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromSeatmap.SEATMAP_FEATURE_KEY,
      fromSeatmap.reducer
    ),
    EffectsModule.forFeature([SeatmapEffects]),
  ],
})
export class SeatmapDataAccessModule {}
