# Types Module

This module contains pure type definitions for the Checkers domain model.

## Purpose

All type definitions that form the foundation of the checkers game. These are pure type aliases, interfaces, and enums without any implementation logic.

## Types

### Player
```typescript
type Player = 'red' | 'white'
```

### PieceType
```typescript
type PieceType = 'man' | 'king'
```

### Position
```typescript
interface Position {
  row: number
  col: number
}
```

### Piece
```typescript
interface Piece {
  player: Player
  type: PieceType
}
```

### Board
```typescript
type Board = (Piece | null)[][]
```

### Move
```typescript
interface Move {
  from: Position
  to: Position
  captured?: Position[]
}
```

### GameState
```typescript
interface GameState {
  board: Board
  turn: Player
  pieces: {
    red: number
    white: number
  }
}
```

### GameLog
```typescript
type GameLog = Move[]
```

## Notes

- This module has no dependencies on other layers
- Type definitions are immutable and should not contain logic
- All other modules depend on this module
