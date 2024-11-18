import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Match } from '../../models/match.interface';

export const MatchActions = createActionGroup({
  source: 'Match',
  events: {
    'Load Matches': emptyProps(),
    'Load Matches Success': props<{ matches: Match[] }>(),
    'Load Matches Failure': props<{ error: any }>(),
    'Clear Matches': emptyProps(),
    'Generate Matches Success': props<{ matches: Match[] }>(),
    'Update Match Score': props<{ match: Match }>(),
    'Update Match Score Success': props<{ match: Match }>(),
    'Update Match Score Failure': props<{ error: any }>(),
  }
});
