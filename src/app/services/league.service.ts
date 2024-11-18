import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { League } from '../models/league.interface';
import { DEFAULT_LEAGUES } from '../data/leagues.data';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  private readonly STORAGE_KEY = 'leagues';
  private leagues: League[] = [];

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedLeagues = localStorage.getItem(this.STORAGE_KEY);
    if (storedLeagues) {
      this.leagues = JSON.parse(storedLeagues);
    } else {
      // Initialize with default leagues
      this.leagues = DEFAULT_LEAGUES;
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.leagues));
  }

  getLeagues(): Observable<League[]> {
    return of([...this.leagues]);
  }

  addLeague(league: Omit<League, 'id'>): Observable<League> {
    const newLeague = { ...league, id: this.getNextId() };
    this.leagues = [...this.leagues, newLeague];
    this.saveToLocalStorage();
    return of(newLeague);
  }

  deleteLeague(id: number): Observable<void> {
    this.leagues = this.leagues.filter(league => league.id !== id);
    this.saveToLocalStorage();
    return of(void 0);
  }

  private getNextId(): number {
    return this.leagues.length ? Math.max(...this.leagues.map(l => l.id)) + 1 : 1;
  }
}
