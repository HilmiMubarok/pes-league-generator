// src/app/components/league-bracket/league-bracket.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { StandingComponent } from '../standing/standing.component';

interface Match {
  player1: string;
  player2: string;
  score1?: number;
  score2?: number;
  saved: boolean;
}

interface Standing {
  player: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

@Component({
  selector: 'app-league-bracket',
  standalone: true,
  imports: [CommonModule, FormsModule, StandingComponent],
  templateUrl: './league-bracket.component.html',
  styleUrls: ['./league-bracket.component.css'],
})
export class LeagueBracketComponent implements OnInit {
  players: string[] = [];
  matches: Match[] = [];
  standings: Standing[] = [];

  constructor(private router: Router, private playerService: PlayerService) {}

  ngOnInit() {
    this.players = this.playerService.getPlayers();
    if (this.players.length < 2) {
      this.router.navigate(['/setup']);
    } else {
      this.generateMatches();
      this.initializeStandings();
    }
  }

  generateMatches() {
    for (let i = 0; i < this.players.length; i++) {
      for (let j = 0; j < this.players.length; j++) {
        if (i !== j) {
          this.matches.push({
            player1: this.players[i],
            player2: this.players[j],
            saved: false,
          });
        }
      }
    }
  }

  initializeStandings() {
    this.standings = this.players.map((player) => ({
      player,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    }));
  }

  saveScore(match: Match) {
    if (match.score1 !== undefined && match.score2 !== undefined) {
      match.saved = true;
      this.updateStandings();
    } else {
      alert('Please enter scores for both players');
    }
  }

  updateStandings() {
    this.initializeStandings(); // Reset standings

    for (const match of this.matches) {
      if (
        match.saved &&
        match.score1 !== undefined &&
        match.score2 !== undefined
      ) {
        const player1Standing = this.standings.find(
          (s) => s.player === match.player1
        )!;
        const player2Standing = this.standings.find(
          (s) => s.player === match.player2
        )!;

        player1Standing.played++;
        player2Standing.played++;

        player1Standing.goalsFor += match.score1;
        player1Standing.goalsAgainst += match.score2;
        player2Standing.goalsFor += match.score2;
        player2Standing.goalsAgainst += match.score1;

        if (match.score1 > match.score2) {
          player1Standing.won++;
          player2Standing.lost++;
          player1Standing.points += 3;
        } else if (match.score1 < match.score2) {
          player1Standing.lost++;
          player2Standing.won++;
          player2Standing.points += 3;
        } else {
          player1Standing.drawn++;
          player2Standing.drawn++;
          player1Standing.points += 1;
          player2Standing.points += 1;
        }
      }
    }

    // Calculate goal difference
    this.standings.forEach((standing) => {
      standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
    });

    // Sort standings
    this.standings.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points; // Sort by points
      } else if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference; // Then by goal difference
      } else if (b.goalsFor !== a.goalsFor) {
        return b.goalsFor - a.goalsFor; // Then by goals scored
      } else {
        return a.player.localeCompare(b.player); // Finally alphabetically
      }
    });
  }

  goBack() {
    this.router.navigate(['/team-assignment']);
  }
}
