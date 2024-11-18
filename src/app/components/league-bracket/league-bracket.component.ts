import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Match } from '../../models/match.interface';
import { Player } from '../../models/player.interface';
import { Standing } from '../../models/standing.interface';
import { selectAllPlayers } from '../../store/player/player.selectors';
import { selectAllMatches, selectMatchesLoading, selectMatchesError } from '../../store/match/match.selectors';
import { MatchActions } from '../../store/match/match.actions';
import { PlayerActions } from '../../store/player/player.actions';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-league-bracket',
  templateUrl: './league-bracket.component.html'
})
export class LeagueBracketComponent implements OnInit {
  matches$: Observable<Match[]>;
  players$: Observable<Player[]>;
  standings$: Observable<Standing[]>;
  allMatchesCompleted$: Observable<boolean>;
  isGenerating$ = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean>;
  error$: Observable<any>;
  selectedPlayer: number | null = null;
  filteredMatches$: Observable<Match[]>;

  constructor(
    private store: Store,
    private router: Router,
    private excelService: ExcelService
  ) {
    this.matches$ = this.store.select(selectAllMatches);
    this.players$ = this.store.select(selectAllPlayers);
    this.isLoading$ = this.store.select(selectMatchesLoading);
    this.error$ = this.store.select(selectMatchesError);

    // Calculate standings whenever matches change
    this.standings$ = combineLatest([this.matches$, this.players$]).pipe(
      map(([matches, players]) => this.calculateStandings(matches, players))
    );

    // Initialize filtered matches
    this.filteredMatches$ = this.matches$;

    // Check if all matches are completed
    this.allMatchesCompleted$ = this.matches$.pipe(
      map(matches => matches.length > 0 && matches.every(match => match.completed))
    );
  }

  ngOnInit(): void {
    // First, try to load saved players from localStorage
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) {
      this.store.dispatch(PlayerActions.loadPlayersSuccess({ players: JSON.parse(savedPlayers) }));
    }

    // Check if we have players and generate matches if needed
    combineLatest([this.matches$, this.players$])
      .pipe(take(1))
      .subscribe(([matches, players]) => {
        // If we have saved matches but no players, load from localStorage
        if (players.length === 0) {
          const savedPlayers = localStorage.getItem('players');
          if (savedPlayers) {
            const parsedPlayers = JSON.parse(savedPlayers);
            this.store.dispatch(PlayerActions.loadPlayersSuccess({ players: parsedPlayers }));
          } else {
            this.router.navigate(['/player-setup']);
            return;
          }
        }

        if (matches.length === 0) {
          // Load matches from localStorage first
          const savedMatches = localStorage.getItem('leagueMatches');
          if (savedMatches) {
            this.store.dispatch(MatchActions.loadMatchesSuccess({ matches: JSON.parse(savedMatches) }));
          } else {
            this.generateMatches(players);
          }
        }
      });
  }

  private generateMatches(players: Player[]): void {
    if (players.length < 2) return;

    this.isGenerating$.next(true);
    try {
      const matches: Match[] = [];
      let matchId = 1;
      const isFullSeason = localStorage.getItem('isFullSeason') === 'true';

      // Generate matches where each player plays against every other player
      for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players.length; j++) {
          if (i !== j) { // Avoid self matches
            matches.push({
              id: matchId.toString(),
              round: Math.floor((matchId - 1) / 2) + 1,
              player1: players[i],
              player2: players[j],
              player1Score: 0,
              player2Score: 0,
              completed: false
            });
            matchId++;
          }
        }
      }

      // If not full season, keep only half of the matches
      const finalMatches = isFullSeason ? matches : matches.filter((match, index) => {
        const reverseMatch = matches.find(m => 
          m.player1.id === match.player2.id && 
          m.player2.id === match.player1.id
        );
        return matches.indexOf(reverseMatch!) > index;
      });

      this.store.dispatch(MatchActions.loadMatchesSuccess({ matches: finalMatches }));
    } finally {
      this.isGenerating$.next(false);
    }
  }

  updateMatchScore(match: Match, player1Score: number, player2Score: number): void {
    if (match.completed) return;

    const updatedMatch: Match = {
      ...match,
      player1Score,
      player2Score,
      completed: true
    };

    // Update match in store
    this.store.dispatch(MatchActions.updateMatchScore({ match: updatedMatch }));

    // Save all matches to localStorage
    this.matches$.pipe(take(1)).subscribe(matches => {
      const updatedMatches = matches.map(m => 
        m.id === match.id ? updatedMatch : m
      );
      localStorage.setItem('leagueMatches', JSON.stringify(updatedMatches));
    });
  }

  private calculateStandings(matches: Match[], players: Player[]): Standing[] {
    const standings = new Map<string, Standing>();

    // Initialize standings for all players
    players.forEach(player => {
      standings.set(player.id.toString(), {
        playerId: player.id.toString(),
        playerName: player.name,
        teamName: player.assignedTeam?.name || '',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      });
    });

    // Calculate standings from completed matches
    matches.filter(m => m.completed).forEach(match => {
      const player1Standing = standings.get(match.player1.id.toString());
      const player2Standing = standings.get(match.player2.id.toString());
      
      if (player1Standing && player2Standing) {
        // Update matches played
        player1Standing.played++;
        player2Standing.played++;

        // Update goals
        player1Standing.goalsFor += match.player1Score || 0;
        player1Standing.goalsAgainst += match.player2Score || 0;
        player2Standing.goalsFor += match.player2Score || 0;
        player2Standing.goalsAgainst += match.player1Score || 0;

        // Update results
        if (match.player1Score! > match.player2Score!) {
          player1Standing.won++;
          player2Standing.lost++;
          player1Standing.points += 3;
        } else if (match.player1Score! < match.player2Score!) {
          player2Standing.won++;
          player1Standing.lost++;
          player2Standing.points += 3;
        } else {
          player1Standing.drawn++;
          player2Standing.drawn++;
          player1Standing.points += 1;
          player2Standing.points += 1;
        }
      }
    });

    // Convert to array and sort by points, then goal difference
    return Array.from(standings.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const aGD = a.goalsFor - a.goalsAgainst;
      const bGD = b.goalsFor - b.goalsAgainst;
      if (bGD !== aGD) return bGD - aGD;
      return b.goalsFor - a.goalsFor;
    });
  }

  async downloadStandingsToExcel(standings: Standing[]): Promise<void> {
    try {
      // Prepare data for Excel
      const data = standings.map(standing => ({
        'Player': standing.playerName,
        'Team': standing.teamName,
        'Played': standing.played,
        'Won': standing.won,
        'Drawn': standing.drawn,
        'Lost': standing.lost,
        'Goals For': standing.goalsFor,
        'Goals Against': standing.goalsAgainst,
        'Points': standing.points
      }));

      // Generate filename with current date and time
      const now = new Date();
      const filename = `League_Standings_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}.xlsx`;

      await this.excelService.exportToExcel(data, filename);
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  }

  async finishLeague(standings: Standing[]): Promise<void> {
    try {
      // Prepare data for Excel
      const data = standings.map(standing => ({
        'Player': standing.playerName,
        'Team': standing.teamName,
        'Played': standing.played,
        'Won': standing.won,
        'Drawn': standing.drawn,
        'Lost': standing.lost,
        'Goals For': standing.goalsFor,
        'Goals Against': standing.goalsAgainst,
        'Points': standing.points
      }));

      // Generate filename with current date and time
      const now = new Date();
      const filename = `League_Standings_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}.xlsx`;

      // Export to Excel
      await this.excelService.exportToExcel(data, filename);

      // Save current teams and leagues data
      const teamsData = localStorage.getItem('teams');
      const leaguesData = localStorage.getItem('leagues');

      // Clear all data from localStorage
      localStorage.clear();

      // Restore teams and leagues data
      if (teamsData) {
        localStorage.setItem('teams', teamsData);
      }
      if (leaguesData) {
        localStorage.setItem('leagues', leaguesData);
      }

      // Clear players from store
      this.store.dispatch(PlayerActions.clearPlayers());

      // Clear matches and reset store
      this.store.dispatch(PlayerActions.loadPlayersSuccess({ players: [] }));
      localStorage.removeItem('players');
      localStorage.removeItem('leagueMatches');
      localStorage.removeItem('isFullSeason');

      // Navigate back to team setup
      this.router.navigate(['/team-setup']);
    } catch (error) {
      console.error('Error finishing league:', error);
    }
  }

  togglePlayerFilter(playerId: number) {
    if (this.selectedPlayer === playerId) {
      this.selectedPlayer = null;
      this.filteredMatches$ = this.matches$;
    } else {
      this.selectedPlayer = playerId;
      this.filteredMatches$ = this.matches$.pipe(
        map(matches => matches.filter(match => 
          match.player1.id === playerId
        ))
      );
    }
  }
}
