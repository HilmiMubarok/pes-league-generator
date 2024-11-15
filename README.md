# Project: Random Team Selector App for PES 2025 Game Nights

## Objective

Create a streamlined web app using Angular v16 and TailwindCSS that facilitates fair team assignment for PES 2025 game sessions. This app aims to prevent conflicts when multiple players want the same team by randomly assigning teams and displaying a league-style bracket to organize matchups.

## Use Case

During PES 2025 game nights with friends, it's common for players to prefer the same popular teams, often leading to unbalanced games. This app resolves the issue by assigning teams randomly and displaying a structured league bracket for organized gameplay.

## Requirements

1. **Player Setup Stage:**

   - A form to input the total number of players.
   - Upon clicking "Next," navigate to a screen where each player can enter their name.

2. **Random Team Assignment:**

   - After all player names are entered and submitted, each player is assigned a team at random, ensuring no team is selected more than once.

3. **League Bracket Generation:**
   - Display a league-style bracket after teams are assigned, which organizes players into matchups and tracks progression through each round.

## Technology Stack

- **Frontend Framework**: Angular v16
- **Styling**: TailwindCSS for a responsive, modern UI.

## Key Features to Include

- Clean, intuitive UI that’s responsive on different devices.
- Validation for player names and number of players (e.g., minimum and maximum player limits).
- Smooth transitions between setup, team assignment, and bracket stages.
- Clear, visually organized display of randomized teams and the league bracket, making it easy to follow matchups.
