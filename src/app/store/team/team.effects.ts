import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { TeamService } from '../../services/team.service';
import { TeamActions } from './team.actions';

@Injectable()
export class TeamEffects {
  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.loadTeams),
      mergeMap(() =>
        this.teamService.getTeams().pipe(
          map((teams) => TeamActions.loadTeamsSuccess({ teams })),
          catchError((error) => of(TeamActions.loadTeamsFailure({ error })))
        )
      )
    )
  );

  addTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.addTeam),
      mergeMap(({ team }) =>
        this.teamService.addTeam(team).pipe(
          map((newTeam) => TeamActions.addTeamSuccess({ team: newTeam })),
          catchError((error) => of(TeamActions.addTeamFailure({ error })))
        )
      )
    )
  );

  deleteTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.deleteTeam),
      mergeMap(({ id }) =>
        this.teamService.deleteTeam(id).pipe(
          map(() => TeamActions.deleteTeamSuccess({ id })),
          catchError((error) => of(TeamActions.deleteTeamFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private teamService: TeamService
  ) {}
}
