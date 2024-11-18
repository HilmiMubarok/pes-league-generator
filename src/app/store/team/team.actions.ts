import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Team } from '../../models/team.interface';

export const TeamActions = createActionGroup({
  source: 'Team',
  events: {
    'Load Teams': emptyProps(),
    'Load Teams Success': props<{ teams: Team[] }>(),
    'Load Teams Failure': props<{ error: any }>(),
    'Add Team': props<{ team: Team }>(),
    'Add Team Success': props<{ team: Team }>(),
    'Add Team Failure': props<{ error: any }>(),
    'Delete Team': props<{ id: number }>(),
    'Delete Team Success': props<{ id: number }>(),
    'Delete Team Failure': props<{ error: any }>(),
  },
});
