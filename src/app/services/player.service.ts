import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Player } from '../models/player.interface';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private readonly STORAGE_KEY = 'players';
  private players: Player[] = [];
  private nextId: number = 1;

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedPlayers = localStorage.getItem(this.STORAGE_KEY);
    if (storedPlayers) {
      try {
        const parsedPlayers = JSON.parse(storedPlayers);
        if (Array.isArray(parsedPlayers)) {
          this.players = parsedPlayers.map((player: Partial<Player>) => ({
            id: typeof player.id === 'number' ? player.id : this.getNextId(),
            name: typeof player.name === 'string' ? player.name : '',
            assignedTeam: player.assignedTeam,
            assignedTeamId: typeof player.assignedTeamId === 'number' ? player.assignedTeamId : undefined
          })).filter(player => player.name !== ''); // Filter out invalid players
          
          // Update nextId based on existing players
          this.nextId = Math.max(...this.players.map(p => p.id), 0) + 1;
        }
      } catch (error) {
        console.error('Error loading players from localStorage:', error);
        this.players = [];
      }
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.players));
  }

  getPlayers(): Observable<Player[]> {
    return of([...this.players]);
  }

  addPlayer(player: Omit<Player, 'id'>): Observable<Player> {
    const newPlayer: Player = {
      ...player,
      id: this.getNextId()
    };
    this.players = [...this.players, newPlayer];
    this.nextId++; // Increment nextId after using it
    this.saveToLocalStorage();
    return of(newPlayer);
  }

  updatePlayer(player: Player): Observable<Player> {
    const index = this.players.findIndex(p => p.id === player.id);
    if (index !== -1) {
      this.players = [
        ...this.players.slice(0, index),
        player,
        ...this.players.slice(index + 1)
      ];
      this.saveToLocalStorage();
    }
    return of(player);
  }

  deletePlayer(id: number): Observable<void> {
    this.players = this.players.filter(player => player.id !== id);
    this.saveToLocalStorage();
    return of(void 0);
  }

  clearPlayers(): Observable<void> {
    this.players = [];
    this.nextId = 1; // Reset nextId when clearing players
    this.saveToLocalStorage();
    return of(void 0);
  }

  private getNextId(): number {
    return this.nextId;
  }
}
