import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { MatchActions } from './match.actions';
import { MatchService } from '../../services/match.service';

@Injectable()
export class MatchEffects {
  loadMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchActions.loadMatches),
      mergeMap(() => this.matchService.getMatches()
        .pipe(
          map(matches => MatchActions.loadMatchesSuccess({ matches })),
          catchError(error => of(MatchActions.loadMatchesFailure({ error })))
        ))
    )
  );

  updateMatchScore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchActions.updateMatchScore),
      mergeMap(({ match }) => this.matchService.updateMatchScore(match)
        .pipe(
          map(updatedMatch => MatchActions.updateMatchScoreSuccess({ match: updatedMatch })),
          catchError(error => of(MatchActions.updateMatchScoreFailure({ error })))
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private matchService: MatchService
  ) {}
}
