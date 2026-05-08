# Checkers CLI Game Architecture

## Overview

This project implements a CLI-based Checkers (Draughts) game following a layered architecture pattern. Each layer has a single responsibility and depends only on the layers below it.

## Layered Architecture

```
┌─────────────────┐
│     UI Layer    │  (Command-line interface)
├─────────────────┤
│  Runtime Layer  │  (Game loop, orchestration)
├─────────────────┤
│  Service Layer  │  (Business logic)
├─────────────────┤
│   Repo Layer    │  (Data persistence)
├─────────────────┤
│   Config Layer  │  (Constants)
├─────────────────┤
│   Types Layer   │  (Type definitions)
└─────────────────┘
```

## Modules and Responsibilities

### 1. Types Layer (`src/types/`)
**Purpose:** Pure type definitions that form the foundation of the domain model.

**Responsibilities:**
- Define all TypeScript/JavaScript types for the checkers domain
- Include only type aliases, interfaces, and enums (no logic)
- No dependencies on other layers

**Exposed Types:**
- `Player`: `'red' | 'white'`
- `PieceType`: `'man' | 'king'`
- `Position`: `{ row: number; col: number }`
- `Piece`: `{ player: Player; type: PieceType }`
- `Board`: 8x8 array of `Piece | null`
- `Move`: `{ from: Position; to: Position; captured?: Position[] }`
- `GameState`: `{ board: Board; turn: Player; pieces: { red: number; white: number } }`
- `GameLog`: Array of `Move` objects

### 2. Config Layer (`src/config/`)
**Purpose:** Centralized configuration constants.

**Responsibilities:**
- Define board dimensions and constants
- Store default game values
- No dependencies (depends only on native types)

**Exposed Constants:**
- `BOARD_SIZE`: `8`
- `ROWS`: `0..7`
- `COLS`: `0..7`
- `INITIAL_PIECES_COUNT`: `12` per player
- `PLAYER_COLORS`: `{ red: 'red'; white: 'white' }`
- `PIECE_VALUES`: `{ man: 1; king: 3 }` (for scoring)
- `DIRECTION`: `{ red: -1; white: 1 }` (movement direction)

### 3. Repo Layer (`src/repo/`)
**Purpose:** Data persistence operations.

**Responsibilities:**
- Save game state to storage
- Load game state from storage
- Support both file system and in-memory storage
- No business logic, only data access

**Exposed Interfaces:**
```typescript
interface GameRepo {
  save(gameState: GameState, filename?: string): Promise<void>
  load(filename?: string): Promise<GameState | null>
  listSaves(): Promise<string[]>
}
```

**Implementation Options:**
- `InMemoryRepo`: For temporary storage during a session
- `FileRepo`: For persistent storage using JSON files

### 4. Service Layer (`src/service/`)
**Purpose:** Core game logic and validation.

**Responsibilities:**
- Validate move legality
- Calculate captures and kinging
- Update game state
- Detect win conditions
- Generate valid moves for current turn

**Exposed Interfaces:**
```typescript
interface GameService {
  isValidMove(gameState: GameState, move: Move): boolean
  getValidMoves(gameState: GameState): Move[]
  applyMove(gameState: GameState, move: Move): GameState
  isKingingMove(move: Move): boolean
  checkWin(gameState: GameState): Player | 'draw' | null
  getCapturedPieces(gameState: GameState, move: Move): Position[]
}
```

**Key Functions:**
- `isValidMove`: Checks if a move follows checkers rules
- `getValidMoves`: Returns all legal moves for current player
- `applyMove`: Returns new game state after move execution
- `checkWin`: Determines if game has ended

### 5. Runtime Layer (`src/runtime/`)
**Purpose:** Application lifecycle and game loop orchestration.

**Responsibilities:**
- Initialize game state
- Manage game loop (turn alternation)
- Handle user input and output
- Coordinate between UI and service layers
- Save/load game state

**Exposed Interfaces:**
```typescript
interface GameRuntime {
  startNewGame(): void
  loadGame(filename?: string): void
  run(): void
  saveCurrentState(filename?: string): void
}
```

**Key Responsibilities:**
- Create initial game state
- Loop until win condition
- Prompt for input, validate, and execute moves
- Display board and game status

### 6. UI Layer (`src/ui/`)
**Purpose:** CLI interface for user interaction.

**Responsibilities:**
- Display the game board
- Prompt for move input
- Display game messages and errors
- Parse move notation (e.g., "e2-d3")

**Exposed Interfaces:**
```typescript
interface Ui {
  displayBoard(board: Board): void
  promptMove(player: Player): string
  displayMessage(message: string): void
  displayError(message: string): void
  parseMoveInput(input: string): { from: Position; to: Position } | null
}
```

**Functions:**
- `displayBoard`: ASCII art representation of the board
- `promptMove`: Ask current player for their move
- `parseMoveInput`: Convert "e2-d3" to position objects

### 7. Providers Layer (`src/providers/`)
**Purpose:** Cross-cutting concerns and dependency injection.

**Responsibilities:**
- Provide singleton instances of services
- Configure dependencies between layers
- No business logic

**Provides:**
- `gameRepo`: Instance of `GameRepo` (file or in-memory)
- `gameService`: Instance of `GameService`
- `ui`: Instance of `Ui`

### 8. Utils Layer (`src/utils/`)
**Purpose:** Pure helper functions.

**Responsibilities:**
- Position utility functions
- Move notation parsing
- String formatting

**Exposed Functions:**
- `positionToNotation(pos: Position): string` → "e2"
- `notationToPosition(notation: string): Position | null` → { row: 5, col: 4 }
- `isValidPosition(pos: Position): boolean`
- `getDistance(move: Move): number`
- `formatBoardState(board: Board): string`

## Dependency Chain

```
types ← config ← repo ← service ← runtime ← ui
```

- `types`: No dependencies (foundation)
- `config`: Depends on types (uses type definitions)
- `repo`: Depends on types (reads/writes GameState)
- `service`: Depends on types and config (uses constants for logic)
- `runtime`: Depends on types, repo, service (orchestrates all)
- `ui`: Depends on types (displays board, parses moves)
- `providers`: Depends on all layers (wire them together)
- `utils`: Depends on types (position utilities)

## Layer Necessity

| Layer | Required | Reason |
|-------|----------|--------|
| Types | ✅ | Core domain modeling |
| Config | ✅ | Centralized constants |
| Repo | ✅ | Save/load functionality |
| Service | ✅ | Game logic validation |
| Runtime | ✅ | Game loop orchestration |
| UI | ✅ | User interaction |
| Providers | ✅ | Dependency management |
| Utils | ✅ | Position parsing helpers |
