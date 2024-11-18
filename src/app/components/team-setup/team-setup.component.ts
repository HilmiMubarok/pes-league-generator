import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, take } from 'rxjs';
import { Team } from '../../models/team.interface';
import { League } from '../../models/league.interface';
import { TeamActions } from '../../store/team/team.actions';
import {
  selectAllTeams,
  selectTeamsError,
  selectTeamsLoading,
} from '../../store/team/team.selectors';
import { LeagueService } from '../../services/league.service';

interface TeamsByLeague {
  league: string;
  leagueId: number;
  teams: Team[];
}

@Component({
  selector: 'app-team-setup',
  templateUrl: './team-setup.component.html'
})
export class TeamSetupComponent implements OnInit {
  teamForm: FormGroup;
  teams$: Observable<Team[]>;
  leagues$: Observable<League[]>;
  teamsByLeague$: Observable<TeamsByLeague[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private leagueService: LeagueService
  ) {
    // Initialize form
    this.teamForm = this.initForm();

    // Initialize observables
    this.teams$ = this.store.select(selectAllTeams);
    this.leagues$ = this.leagueService.getLeagues();
    this.loading$ = this.store.select(selectTeamsLoading);
    this.error$ = this.store.select(selectTeamsError);

    // Initialize teamsByLeague$
    this.teamsByLeague$ = this.initTeamsByLeague();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      league_id: ['', [Validators.required]]
    });
  }

  private initTeamsByLeague(): Observable<TeamsByLeague[]> {
    return combineLatest([this.teams$, this.leagues$]).pipe(
      map(([teams, leagues]) => {
        // First, group teams by league_id
        const groupedTeams = teams.reduce((acc, team) => {
          const leagueId = team.league_id;
          if (!acc[leagueId]) {
            acc[leagueId] = [];
          }
          acc[leagueId].push(team);
          return acc;
        }, {} as { [key: number]: Team[] });

        // Then, create TeamsByLeague array with league names
        return leagues.map(league => ({
          leagueId: league.id,
          league: league.name,
          teams: (groupedTeams[league.id] || []).sort((a, b) => a.name.localeCompare(b.name))
        })).filter(group => group.teams.length > 0);
      })
    );
  }

  ngOnInit(): void {
    // Try to load teams from localStorage first
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      this.store.dispatch(TeamActions.loadTeamsSuccess({ teams: JSON.parse(savedTeams) }));
    } else {
      this.store.dispatch(TeamActions.loadTeams());
    }
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      const { name, league_id } = this.teamForm.value;
      const team: Omit<Team, 'id'> = {
        name: name.trim(),
        league_id: Number(league_id)
      };
      this.store.dispatch(TeamActions.addTeam({ team: team as Team }));

      // Save teams to localStorage after adding
      // this.teams$.pipe(take(1)).subscribe(teams => {
      //   localStorage.setItem('teams', JSON.stringify([...teams, team]));
      // });

      this.teamForm.reset();
    } else {
      this.markFormGroupTouched(this.teamForm);
    }
  }

  deleteTeam(id: number): void {
    if (confirm('Are you sure you want to delete this team?')) {
      this.store.dispatch(TeamActions.deleteTeam({ id }));

      // Update localStorage after deleting
      this.teams$.pipe(take(1)).subscribe(teams => {
        const updatedTeams = teams.filter(t => t.id !== id);
        localStorage.setItem('teams', JSON.stringify(updatedTeams));
      });
    }
  }

  clearAllTeams(): void {
    if (confirm('Are you sure you want to clear all teams? This action cannot be undone.')) {
      // Clear localStorage
      localStorage.removeItem('teams');
      
      // Clear store
      this.store.dispatch(TeamActions.loadTeamsSuccess({ teams: [] }));

      // refresh window
      window.location.reload();
    }
  }

  goToPlayerSetup(): void {
    this.teams$.pipe(take(1)).subscribe(teams => {
      if (teams.length < 2) {
        alert('Please add at least 2 teams before proceeding to player setup.');
        return;
      }

      // Save teams to localStorage
      localStorage.setItem('teams', JSON.stringify(teams));
      
      // Initialize empty players array in localStorage
      if (!localStorage.getItem('players')) {
        localStorage.setItem('players', JSON.stringify([]));
      }

      this.router.navigate(['/player-setup']);
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
