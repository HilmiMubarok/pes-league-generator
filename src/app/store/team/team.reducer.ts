import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Team } from '../../models/team.interface';
import { TeamActions } from './team.actions';

export interface TeamState extends EntityState<Team> {
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<Team> = createEntityAdapter<Team>();

export const initialState: TeamState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const teamReducer = createReducer(
  initialState,
  on(TeamActions.loadTeams, (state) => ({
    ...state,
    loading: true,
  })),
  on(TeamActions.loadTeamsSuccess, (state, { teams }) =>
    adapter.setAll(teams, { ...state, loading: false })
  ),
  on(TeamActions.loadTeamsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(TeamActions.addTeam, (state) => ({
    ...state,
    loading: true,
  })),
  on(TeamActions.addTeamSuccess, (state, { team }) =>
    adapter.addOne(team, { ...state, loading: false })
  ),
  on(TeamActions.addTeamFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(TeamActions.deleteTeam, (state) => ({
    ...state,
    loading: true,
  })),
  on(TeamActions.deleteTeamSuccess, (state, { id }) =>
    adapter.removeOne(id, { ...state, loading: false })
  ),
  on(TeamActions.deleteTeamFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);

export const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();
