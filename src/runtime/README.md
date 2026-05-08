# Runtime Module

This module orchestrates the game loop and application lifecycle.

## Purpose

Manage the overall game flow, coordinate between layers, and handle the interactive game session.

## Interface

```typescript
export interface GameRuntime {
  startNewGame(): void
  loadGame(filename?: string): void
  run(): void
  saveCurrentState(filename?: string): void
}
```

## Responsibilities

### Game Loop
1. Initialize or load game state
2. Display current board
3. Prompt current player for move
4. Validate and apply move
5. Check for win condition
6. Repeat until game ends

### State Management
- Maintain current game state
- Track move history
- Handle player turns

### Input/Output
- Use UI layer to display board and prompt moves
- Use service layer to validate and apply moves
- Use repo layer for save/load operations

## Usage

```typescript
import { createGameRuntime } from '../runtime'

const runtime = createGameRuntime()
runtime.startNewGame()
runtime.run()
```

## Notes

- Depends on `types`, `repo`, `service`, and `ui` modules
- Acts as the "glue" layer connecting all components
- No game logic should be implemented here
