import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, interval, timer } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Player } from '../../models/player.interface';
import { Team } from '../../models/team.interface';
import { selectAllPlayers } from '../../store/player/player.selectors';
import { selectAllTeams } from '../../store/team/team.selectors';
import { PlayerActions } from '../../store/player/player.actions';
import { TeamActions } from '../../store/team/team.actions';

@Component({
  selector: 'app-match-setup',
  templateUrl: './match-setup.component.html'
})
export class MatchSetupComponent implements OnInit, OnDestroy {
  players$: Observable<Player[]>;
  teams$: Observable<Team[]>;
  assignedPlayers: (Player & { assignedTeam?: Team })[] = [];
  isFullSeason = true;
  isRandomizing = false;
  private randomizeSubscription?: Subscription;

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.players$ = this.store.select(selectAllPlayers);
    this.teams$ = this.store.select(selectAllTeams);
  }

  ngOnInit(): void {
    // First check localStorage for required data
    const savedPlayers = localStorage.getItem('players');
    const savedTeams = localStorage.getItem('teams');

    if (!savedPlayers || !savedTeams) {
      this.router.navigate(['/team-setup']);
      return;
    }

    // Load data from localStorage into store
    const players = JSON.parse(savedPlayers);
    const teams = JSON.parse(savedTeams);

    if (players.length === 0 || teams.length < 2) {
      this.router.navigate(['/team-setup']);
      return;
    }

    // Initialize component with saved data
    this.assignedPlayers = players;
    // Reset randomizing flag on init
    this.isRandomizing = false;

    // Subscribe to teams$ to check if data is loaded
    this.teams$.pipe(take(1)).subscribe(teams => {
      console.log('Teams in store:', teams);
      if (teams.length === 0) {
        console.log('No teams in store, reloading from localStorage');
        // Dispatch teams to store if not present
        const savedTeams = JSON.parse(localStorage.getItem('teams') || '[]') as Team[];
        savedTeams.forEach((team: Team) => {
          this.store.dispatch(TeamActions.addTeam({ team }));
        });
      }
    });

    // Subscribe to players$ to check if data is loaded
    this.players$.pipe(take(1)).subscribe(players => {
      console.log('Players in store:', players);
      if (players.length === 0) {
        console.log('No players in store, reloading from localStorage');
        // Dispatch players to store if not present
        const savedPlayers = JSON.parse(localStorage.getItem('players') || '[]') as Player[];
        savedPlayers.forEach((player: Player) => {
          this.store.dispatch(PlayerActions.addPlayer({ player }));
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.randomizeSubscription) {
      this.randomizeSubscription.unsubscribe();
    }
    this.isRandomizing = false;
  }

  randomizeTeams(): void {
    console.log('Randomize button clicked');
    if (this.isRandomizing) {
      console.log('Already randomizing, returning');
      return;
    }

    // Clean up any existing subscription
    if (this.randomizeSubscription) {
      console.log('Cleaning up existing subscription');
      this.randomizeSubscription.unsubscribe();
    }

    this.isRandomizing = true;
    const ANIMATION_DURATION = 3000; // 3 seconds
    const INTERVAL = 100; // Update every 100ms

    this.teams$.pipe(take(1)).subscribe({
      next: (teams) => {
        console.log('Teams received:', teams);
        if (teams.length === 0) {
          console.log('No teams available');
          this.isRandomizing = false;
          return;
        }

        try {
          // Create a visual randomization effect
          this.randomizeSubscription = interval(INTERVAL)
            .pipe(takeUntil(timer(ANIMATION_DURATION)))
            .subscribe({
              next: () => {
                // Temporary randomization for visual effect
                const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
                this.assignedPlayers = this.assignedPlayers.map((player, index) => ({
                  ...player,
                  assignedTeam: shuffledTeams[index % shuffledTeams.length]
                }));
              },
              complete: () => {
                // Final randomization
                const finalTeams = [...teams].sort(() => Math.random() - 0.5);
                this.assignedPlayers = this.assignedPlayers.map((player, index) => {
                  const assignedTeam = finalTeams[index % finalTeams.length];
                  return {
                    ...player,
                    assignedTeam,
                    assignedTeamId: assignedTeam.id
                  };
                });

                // Update players with assigned teams in the store and localStorage
                this.assignedPlayers.forEach(player => {
                  this.store.dispatch(PlayerActions.updatePlayer({
                    player: {
                      id: player.id,
                      name: player.name,
                      assignedTeam: player.assignedTeam,
                      assignedTeamId: player.assignedTeamId
                    }
                  }));
                });

                // Save all players to localStorage
                localStorage.setItem('players', JSON.stringify(this.assignedPlayers));
                this.isRandomizing = false;
              },
              error: () => {
                this.isRandomizing = false;
              }
            });
        } catch (error) {
          this.isRandomizing = false;
          console.error('Error during randomization:', error);
        }
      },
      error: () => {
        this.isRandomizing = false;
      }
    });
  }

  startLeague(): void {
    // Check if all players have teams assigned
    if (this.assignedPlayers.some(player => !player.assignedTeam)) {
      alert('Please randomize teams before starting the league.');
      return;
    }

    if (this.assignedPlayers.length < 2) {
      alert('At least 2 players are required to start the league.');
      return;
    }
    
    // Store season type and players in localStorage
    localStorage.setItem('isFullSeason', this.isFullSeason.toString());
    localStorage.setItem('players', JSON.stringify(this.assignedPlayers));
    this.router.navigate(['/league-bracket']);
  }

  toggleSeasonType(): void {
    this.isFullSeason = !this.isFullSeason;
  }
}
