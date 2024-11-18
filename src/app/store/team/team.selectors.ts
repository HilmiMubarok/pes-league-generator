import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TeamState, adapter } from './team.reducer';

export const selectTeamState = createFeatureSelector<TeamState>('teams');

export const {
  selectIds: selectTeamIds,
  selectEntities: selectTeamEntities,
  selectAll: selectAllTeams,
  selectTotal: selectTotalTeams,
} = adapter.getSelectors(selectTeamState);

export const selectTeamsLoading = createSelector(
  selectTeamState,
  (state: TeamState) => state.loading
);

export const selectTeamsError = createSelector(
  selectTeamState,
  (state: TeamState) => state.error
);
