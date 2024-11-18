import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MatchState } from './match.reducer';

export const selectMatchState = createFeatureSelector<MatchState>('matches');

export const selectAllMatches = createSelector(
  selectMatchState,
  (state) => state.matches
);

export const selectMatchesLoading = createSelector(
  selectMatchState,
  (state) => state.loading
);

export const selectMatchesError = createSelector(
  selectMatchState,
  (state) => state.error
);
