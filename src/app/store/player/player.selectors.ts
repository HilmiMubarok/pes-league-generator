import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState, adapter } from './player.reducer';

export const selectPlayerState = createFeatureSelector<PlayerState>('players');

export const {
  selectIds: selectPlayerIds,
  selectEntities: selectPlayerEntities,
  selectAll: selectAllPlayers,
  selectTotal: selectTotalPlayers,
} = adapter.getSelectors(selectPlayerState);

export const selectPlayersLoading = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.loading
);

export const selectPlayersError = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.error
);

export const selectTotalPlayersCount = createSelector(
  selectPlayerState,
  (state: PlayerState) => state.totalPlayers
);
