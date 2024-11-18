import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Player } from '../../models/player.interface';
import { PlayerActions } from './player.actions';

export interface PlayerState extends EntityState<Player> {
  loading: boolean;
  error: any;
  totalPlayers: number;
}

export const adapter: EntityAdapter<Player> = createEntityAdapter<Player>();

export const initialState: PlayerState = adapter.getInitialState({
  loading: false,
  error: null,
  totalPlayers: 0,
});

export const playerReducer = createReducer(
  initialState,
  on(PlayerActions.setTotalPlayers, (state, { total }) => ({
    ...state,
    totalPlayers: total,
  })),
  on(PlayerActions.loadPlayers, (state) => ({
    ...state,
    loading: true,
  })),
  on(PlayerActions.loadPlayersSuccess, (state, { players }) =>
    adapter.setAll(players, { ...state, loading: false })
  ),
  on(PlayerActions.loadPlayersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(PlayerActions.addPlayer, (state) => ({
    ...state,
    loading: true,
  })),
  on(PlayerActions.addPlayerSuccess, (state, { player }) =>
    adapter.addOne(player, { ...state, loading: false })
  ),
  on(PlayerActions.addPlayerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(PlayerActions.updatePlayer, (state) => ({
    ...state,
    loading: true,
  })),
  on(PlayerActions.updatePlayerSuccess, (state, { player }) =>
    adapter.updateOne(
      { id: player.id, changes: player },
      { ...state, loading: false }
    )
  ),
  on(PlayerActions.updatePlayerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(PlayerActions.deletePlayer, (state) => ({
    ...state,
    loading: true,
  })),
  on(PlayerActions.deletePlayerSuccess, (state, { id }) =>
    adapter.removeOne(id, { ...state, loading: false })
  ),
  on(PlayerActions.deletePlayerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(PlayerActions.clearPlayers, () => initialState)
);

export const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();
