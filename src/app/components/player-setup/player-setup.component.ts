// src/app/components/player-setup/player-setup.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-setup.component.html',
  styleUrls: ['./player-setup.component.css'],
})
export class PlayerSetupComponent implements OnInit {
  currentStep: 'playerCount' | 'playerNames' = 'playerCount';
  playerCountForm = this.fb.group({
    numberOfPlayers: [
      2,
      [Validators.required, Validators.min(2), Validators.max(8)],
    ],
  });
  playerNamesForm = this.fb.group({
    names: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['step'] === 'playerNames') {
        const savedCount = this.playerService.getNumberOfPlayers();
        const savedPlayers = this.playerService.getPlayers();

        if (savedCount > 0) {
          this.playerCountForm.patchValue({ numberOfPlayers: savedCount });
          this.onPlayerCountSubmit();

          // Populate the player names form with saved names
          savedPlayers.forEach((name, index) => {
            this.playerNames.at(index).setValue(name);
          });
        }
      }
    });
  }

  get playerNames() {
    return this.playerNamesForm.get('names') as FormArray;
  }

  onPlayerCountSubmit() {
    if (this.playerCountForm.valid) {
      const count = this.playerCountForm.get('numberOfPlayers')?.value;
      this.playerService.setNumberOfPlayers(count!);
      this.playerNames.clear();
      for (let i = 0; i < count!; i++) {
        this.playerNames.push(this.fb.control('', Validators.required));
      }
      this.currentStep = 'playerNames';
    }
  }

  getErrorMessage(control: AbstractControl | null): string {
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('min')) {
      return 'Minimum number of players is 2';
    }
    if (control?.hasError('max')) {
      return 'Maximum number of players is 8';
    }
    return '';
  }

  onPlayerNamesSubmit() {
    if (this.playerNamesForm.valid) {
      const playerNames = this.playerNames.value;
      this.playerService.setPlayers(playerNames);
      this.router.navigate(['/team-assignment']);
    } else {
      alert('Please enter names for all players');
    }
  }

  changePlayerCount() {
    this.currentStep = 'playerCount';
    this.playerNames.clear();
    this.playerService.clearPlayers(); // Clear the saved players when changing count
  }
}
