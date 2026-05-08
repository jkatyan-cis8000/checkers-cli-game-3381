# Utils Module

This module contains pure helper functions for position manipulation and input parsing.

## Purpose

Provide utility functions that support other modules without introducing dependencies.

## Functions

### Position Utilities

```typescript
export function positionToNotation(pos: Position): string
```
Converts position to notation:
- `{ row: 5, col: 4 }` → `"e2"`
- Columns: 0→a, 1→b, ..., 7→h
- Rows: 7→1, 6→2, ..., 0→8 (for standard checkers notation)

```typescript
export function notationToPosition(notation: string): Position | null
```
Converts notation to position:
- `"e2"` → `{ row: 5, col: 4 }`
- Returns null if notation is invalid

```typescript
export function isValidPosition(pos: Position): boolean
```
Validates that position is within board bounds.

### Move Utilities

```typescript
export function getDistance(move: Move): number
```
Calculates the distance of a move:
- Normal move: 1
- Capture move: 2

### Formatting

```typescript
export function formatBoardState(board: Board): string
```
Formats board state for display or logging.

## Notes

- Depends only on the `types` module
- Pure functions with no side effects
- Used by UI and other modules for helper operations
