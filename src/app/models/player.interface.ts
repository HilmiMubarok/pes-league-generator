import { Team } from './team.interface';

export interface Player {
  id: number;
  name: string;
  assignedTeam?: Team;
  assignedTeamId?: number;
}
