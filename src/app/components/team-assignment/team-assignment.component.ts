// src/app/components/team-assignment/team-assignment.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-team-assignment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-assignment.component.html',
  styleUrls: ['./team-assignment.component.css'],
})
export class TeamAssignmentComponent implements OnInit {
  players: string[] = [];
  teams: { [key: string]: string } = {};
  teamNames: string[] = [
    'Manchester United',
    'Barcelona',
    'Real Madrid',
    'Bayern Munich',
    'Liverpool',
    'Juventus',
    'Paris Saint-Germain',
    'Manchester City',
    'Chelsea',
    'Arsenal',
    'Borussia Dortmund',
    'AC Milan',
    'Inter Milan',
    'Atletico Madrid',
    'Tottenham Hotspur',
    'Ajax',
  ];

  constructor(private router: Router, private playerService: PlayerService) {}

  ngOnInit() {
    this.players = this.playerService.getPlayers();
    if (this.players.length === 0) {
      // If there are no players, redirect back to player setup
      this.router.navigate(['/setup']);
    } else {
      this.assignTeams();
    }
  }

  assignTeams() {
    const shuffledTeams = this.shuffle([...this.teamNames]);
    const assignedTeams = new Set<string>();

    this.players.forEach((player) => {
      let team: string;
      do {
        team = shuffledTeams[Math.floor(Math.random() * shuffledTeams.length)];
      } while (assignedTeams.has(team));

      this.teams[player] = team;
      assignedTeams.add(team);
    });
  }

  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  startTournament() {
    this.router.navigate(['/league-bracket']);
  }

  goBack() {
    this.router.navigate(['/setup'], { queryParams: { step: 'playerNames' } });
  }
}