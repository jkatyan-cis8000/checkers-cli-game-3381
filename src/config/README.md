# Config Module

This module contains centralized configuration constants for the Checkers game.

## Purpose

Define board dimensions, default values, and other constants that are used throughout the application.

## Constants

### Board Dimensions
```typescript
export const BOARD_SIZE = 8
export const ROWS = [0, 1, 2, 3, 4, 5, 6, 7]
export const COLS = [0, 1, 2, 3, 4, 5, 6, 7]
```

### Game Constants
```typescript
export const INITIAL_PIECES_COUNT = 12
export const PLAYER_COLORS = { red: 'red', white: 'white' }
export const PIECE_VALUES = { man: 1, king: 3 }
export const DIRECTION = { red: -1, white: 1 }
```

## Usage

Import constants in other modules that need to reference board dimensions or game values:

```typescript
import { BOARD_SIZE, INITIAL_PIECES_COUNT } from '../config'
```

## Notes

- This module depends only on native JavaScript/TypeScript types
- All configuration should be centralized here for easy modification
- Changing values here affects the entire game behavior
