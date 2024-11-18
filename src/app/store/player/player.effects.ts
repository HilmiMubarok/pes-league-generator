import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { PlayerService } from '../../services/player.service';
import { PlayerActions } from './player.actions';

@Injectable()
export class PlayerEffects {
  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.loadPlayers),
      mergeMap(() =>
        this.playerService.getPlayers().pipe(
          map((players) => PlayerActions.loadPlayersSuccess({ players })),
          catchError((error) => of(PlayerActions.loadPlayersFailure({ error })))
        )
      )
    )
  );

  addPlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.addPlayer),
      mergeMap(({ player }) =>
        this.playerService.addPlayer(player).pipe(
          map((newPlayer) => PlayerActions.addPlayerSuccess({ player: newPlayer })),
          catchError((error) => of(PlayerActions.addPlayerFailure({ error })))
        )
      )
    )
  );

  updatePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.updatePlayer),
      mergeMap(({ player }) =>
        this.playerService.updatePlayer(player).pipe(
          map((updatedPlayer) =>
            PlayerActions.updatePlayerSuccess({ player: updatedPlayer })
          ),
          catchError((error) => of(PlayerActions.updatePlayerFailure({ error })))
        )
      )
    )
  );

  deletePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.deletePlayer),
      mergeMap(({ id }) =>
        this.playerService.deletePlayer(id).pipe(
          map(() => PlayerActions.deletePlayerSuccess({ id })),
          catchError((error) => of(PlayerActions.deletePlayerFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private playerService: PlayerService
  ) {}
}
