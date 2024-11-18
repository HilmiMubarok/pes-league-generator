import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { Player } from '../../models/player.interface';
import { PlayerActions } from '../../store/player/player.actions';
import {
  selectAllPlayers,
  selectPlayersError,
  selectPlayersLoading
} from '../../store/player/player.selectors';

@Component({
  selector: 'app-player-setup',
  templateUrl: './player-setup.component.html'
})
export class PlayerSetupComponent implements OnInit {
  playerForm: FormGroup;
  players$: Observable<Player[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  hasEnoughPlayers$: Observable<boolean>;
  readonly MIN_PLAYERS = 3;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    // Initialize form
    this.playerForm = this.initForm();

    // Initialize observables
    this.players$ = this.store.select(selectAllPlayers);
    this.loading$ = this.store.select(selectPlayersLoading);
    this.error$ = this.store.select(selectPlayersError);
    
    // Add players count validation
    this.hasEnoughPlayers$ = this.players$.pipe(
      map(players => players.length >= this.MIN_PLAYERS)
    );
  }

  private initForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    // First check if there are teams in localStorage
    const savedTeams = localStorage.getItem('teams');
    if (!savedTeams) {
      this.router.navigate(['/team-setup']);
      return;
    }

    // Reset store first
    this.store.dispatch(PlayerActions.clearPlayers());
    this.store.dispatch(PlayerActions.loadPlayersSuccess({ players: [] }));

    // Try to load saved players from localStorage
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) {
      try {
        const players: Player[] = JSON.parse(savedPlayers);
        // Ensure all players have valid IDs
        const validPlayers = players.filter((player: Player): player is Player => 
          Boolean(player && typeof player.id === 'number' && typeof player.name === 'string')
        );
        if (validPlayers.length > 0) {
          this.store.dispatch(PlayerActions.loadPlayersSuccess({ players: validPlayers }));
        } else {
          localStorage.removeItem('players'); // Clear invalid data
        }
      } catch (error) {
        console.error('Error loading players from localStorage:', error);
        localStorage.removeItem('players'); // Clear invalid data
      }
    }
  }

  onSubmit(): void {
    if (this.playerForm.valid) {
      const { name } = this.playerForm.value;
      const player: Omit<Player, 'id'> = {
        name: name.trim()
      };
      this.store.dispatch(PlayerActions.addPlayer({ player: player as Player }));
      this.playerForm.reset();
    } else {
      this.markFormGroupTouched(this.playerForm);
    }
  }

  deletePlayer(id: number): void {
    if (confirm('Are you sure you want to delete this player?')) {
      this.store.dispatch(PlayerActions.deletePlayer({ id }));

      // After deleting a player, update localStorage
      this.players$.pipe(take(1)).subscribe(players => {
        const updatedPlayers = players.filter(p => p.id !== id);
        localStorage.setItem('players', JSON.stringify(updatedPlayers));
      });
    }
  }

  goToMatchSetup(): void {
    // First verify we have enough players
    this.players$.pipe(take(1)).subscribe(players => {
      if (players.length < this.MIN_PLAYERS) {
        alert(`Please add at least ${this.MIN_PLAYERS} players before proceeding.`);
        return;
      }

      // Verify teams exist
      const savedTeams = localStorage.getItem('teams');
      if (!savedTeams || JSON.parse(savedTeams).length < 2) {
        this.router.navigate(['/team-setup']);
        return;
      }

      // Save current players to localStorage and navigate
      localStorage.setItem('players', JSON.stringify(players));
      this.router.navigate(['/match-setup']);
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
