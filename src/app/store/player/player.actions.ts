import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Player } from '../../models/player.interface';

export const PlayerActions = createActionGroup({
  source: 'Player',
  events: {
    'Set Total Players': props<{ total: number }>(),
    'Add Player': props<{ player: Player }>(),
    'Add Player Success': props<{ player: Player }>(),
    'Add Player Failure': props<{ error: any }>(),
    'Update Player': props<{ player: Player }>(),
    'Update Player Success': props<{ player: Player }>(),
    'Update Player Failure': props<{ error: any }>(),
    'Delete Player': props<{ id: number }>(),
    'Delete Player Success': props<{ id: number }>(),
    'Delete Player Failure': props<{ error: any }>(),
    'Load Players': emptyProps(),
    'Load Players Success': props<{ players: Player[] }>(),
    'Load Players Failure': props<{ error: any }>(),
    'Clear Players': emptyProps(),
  },
});
