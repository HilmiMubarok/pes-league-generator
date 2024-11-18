# Project: Random Team Selector App for PES 2025 Game Nights

## Objective

Create a streamlined web app using Angular v16 and TailwindCSS that facilitates fair team assignment for PES 2025 game sessions. This app aims to prevent conflicts when multiple players want the same team by randomly assigning teams and displaying a league-style bracket to organize matchups.

## Use Case

During PES 2025 game nights with friends, it's common for players to prefer the same popular teams, often leading to unbalanced games. This app resolves the issue by assigning teams randomly and displaying a structured league bracket for organized gameplay.

## Requirements

1. **Setup Team Names:**

   - A list of popular football team names.
   - A form to add team names to the list.
   - A button to delete existing team names.
   - Format json data is like :
   ```json
   {
      "leagues": [
         {
            "id": 1,
            "name": "Premier League"
         },
         {
            "id": 2,
            "name": "La Liga"
         }
      ],
      "teams": [
         {
            "id": 1,
            "league_id": 1,
            "name": "Manchester United"
         },
         {
            "id": 2,
            "league_id": 2,
            "name": "Real Madrid"
         }
      ]
   }
   ```

2. **Player Setup Stage:**

   - A form to input the total number of players.
   - Upon clicking "Next," navigate to a screen where each player can enter their name.
   - The "Next" button should be disabled until all players have entered their names.
   - Upon clicking "Next," navigate to the team assignment stage.

3. **League Bracket Generation:**

   - Display a league-style bracket after teams are assigned, which organizes players into matchups and tracks progression through each round.
   - Should follow league rules and ensure fairness in assigning teams.
   - Should display a full season schedule, including all matches and team names.
   - Can add score to each match.
   - Should display standings table below the bracket.
   - Standings table should update in real-time when scores are entered.
   - Standings table should display any points, including GA, GD, and GF.
   - A button to finish the game, and download a PDF of the bracket and standings.
   - Upon clicking the finish button, clear any data in local storage, and navigate to the setup team names stage.

## Technology Stack

- **Frontend Framework**: Angular v16 with standalone components.
- **State Management**: Angular's `NgRx` for state management.
- **Styling**: TailwindCSS for a responsive, modern UI.

## Database

- **Database**: Local storage.

## Key Features to Include

- Clean, intuitive UI that’s responsive on different devices.
- Validation for player names and number of players (e.g., minimum of 3 and maximum player of 24 limits).
- Smooth transitions between setup, team assignment, and bracket stages. including loading indicators.
- Clear, visually organized display of randomized teams and the league bracket, making it easy to follow matchups.
