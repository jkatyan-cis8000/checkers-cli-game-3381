# Repo Module

This module handles data persistence for game state.

## Purpose

Provide interfaces and implementations for saving and loading game states to various storage backends.

## Interface

```typescript
export interface GameRepo {
  save(gameState: GameState, filename?: string): Promise<void>
  load(filename?: string): Promise<GameState | null>
  listSaves(): Promise<string[]>
}
```

## Implementations

### InMemoryRepo
- Stores game state in memory only
- Useful for temporary sessions
- Data is lost when application exits

### FileRepo
- Persists game state to JSON files
- Supports multiple saved games
- Enables loading previous games

## Usage

```typescript
import { FileRepo } from '../repo'

const repo = new FileRepo()
await repo.save(gameState, 'game1.json')
const loaded = await repo.load('game1.json')
```

## Notes

- This module depends on the `types` module
- No business logic should be implemented in repo classes
- Only data access operations are allowed
