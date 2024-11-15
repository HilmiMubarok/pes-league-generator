// src/app/services/player.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private players: string[] = [];
  private numberOfPlayers: number = 2;

  setPlayers(players: string[]) {
    this.players = players;
    this.numberOfPlayers = players.length;
  }

  getPlayers(): string[] {
    return this.players;
  }

  setNumberOfPlayers(count: number) {
    this.numberOfPlayers = count;
  }

  getNumberOfPlayers(): number {
    return this.numberOfPlayers;
  }

  clearPlayers() {
    this.players = [];
    this.numberOfPlayers = 2;
  }
}
