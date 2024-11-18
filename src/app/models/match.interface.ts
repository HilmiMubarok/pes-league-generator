import { Player } from './player.interface';

export interface Match {
  id: string;
  player1: Player;
  player2: Player;
  round: number;
  completed: boolean;
  player1Score?: number;
  player2Score?: number;
}
