import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Team } from '../models/team.interface';
import { DEFAULT_TEAMS } from '../data/teams.data';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly STORAGE_KEY = 'teams';
  private teams: Team[] = [];

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedTeams = localStorage.getItem(this.STORAGE_KEY);
    if (storedTeams) {
      this.teams = JSON.parse(storedTeams);
    } else {
      // Initialize with default teams
      this.teams = DEFAULT_TEAMS;
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.teams));
  }

  getTeams(): Observable<Team[]> {
    return of([...this.teams]);
  }

  getTeamsByLeagueId(leagueId: number): Observable<Team[]> {
    return of(this.teams.filter(team => team.league_id === leagueId));
  }

  addTeam(team: Omit<Team, 'id'>): Observable<Team> {
    const newTeam = { ...team, id: this.getNextId() };
    this.teams = [...this.teams, newTeam];
    this.saveToLocalStorage();
    return of(newTeam);
  }

  deleteTeam(id: number): Observable<void> {
    this.teams = this.teams.filter(team => team.id !== id);
    this.saveToLocalStorage();
    return of(void 0);
  }

  private getNextId(): number {
    return this.teams.length ? Math.max(...this.teams.map(t => t.id)) + 1 : 1;
  }
}
