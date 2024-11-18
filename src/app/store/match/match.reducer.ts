import { createReducer, on } from '@ngrx/store';
import { Match } from '../../models/match.interface';
import { MatchActions } from './match.actions';

export interface MatchState {
  matches: Match[];
  loading: boolean;
  error: any;
}

export const initialState: MatchState = {
  matches: [],
  loading: false,
  error: null
};

export const matchReducer = createReducer(
  initialState,
  on(MatchActions.loadMatches, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MatchActions.loadMatchesSuccess, (state, { matches }) => ({
    ...state,
    matches,
    loading: false
  })),
  on(MatchActions.loadMatchesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(MatchActions.clearMatches, state => ({
    ...state,
    matches: [],
    loading: false,
    error: null
  })),
  on(MatchActions.generateMatchesSuccess, (state, { matches }) => ({
    ...state,
    matches,
    loading: false
  })),
  on(MatchActions.updateMatchScore, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MatchActions.updateMatchScoreSuccess, (state, { match }) => ({
    ...state,
    matches: state.matches.map(m => m.id === match.id ? match : m),
    loading: false
  })),
  on(MatchActions.updateMatchScoreFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
