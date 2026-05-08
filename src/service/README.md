# Service Module

This module contains core game logic and validation.

## Purpose

Implement the rules of checkers including move validation, capture detection, kinging, and win detection.

## Interface

```typescript
export interface GameService {
  isValidMove(gameState: GameState, move: Move): boolean
  getValidMoves(gameState: GameState): Move[]
  applyMove(gameState: GameState, move: Move): GameState
  isKingingMove(move: Move): boolean
  checkWin(gameState: GameState): Player | 'draw' | null
  getCapturedPieces(gameState: GameState, move: Move): Position[]
}
```

## Methods

### isValidMove
Validates if a move follows checkers rules:
- Piece moves diagonally
- Kings can move in any diagonal direction
- Regular men only move forward
- Proper distance (1 for normal, 2 for capture)

### getValidMoves
Returns all legal moves for the current player:
- Includes both normal moves and capture jumps
- If captures are available, may restrict to only captures (standard rule)

### applyMove
Executes a move and returns new game state:
- Updates board positions
- Removes captured pieces
- Checks for kinging
- Updates piece counts
- Switches turn

### isKingingMove
Checks if a move results in a piece becoming a king:
- Red piece reaches row 0
- White piece reaches row 7

### checkWin
Determines if game has ended:
- Returns winning player or 'draw' or null (game continues)

### getCapturedPieces
Returns list of positions that are captured during a move.

## Usage

```typescript
import { createGameService } from '../service'

const service = createGameService()
if (service.isValidMove(gameState, move)) {
  const newState = service.applyMove(gameState, move)
}
```

## Notes

- Depends on `types` and `config` modules
- Pure logic, no UI or storage dependencies
- All state changes should be immutable (return new state)
