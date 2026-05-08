# UI Module

This module handles the command-line interface for user interaction.

## Purpose

Display the game board, prompt for user input, and parse move notation.

## Interface

```typescript
export interface Ui {
  displayBoard(board: Board): void
  promptMove(player: Player): string
  displayMessage(message: string): void
  displayError(message: string): void
  parseMoveInput(input: string): { from: Position; to: Position } | null
}
```

## Methods

### displayBoard
Renders the board as ASCII art:
- Shows piece positions with appropriate symbols
- Displays row and column labels
- Colors may be applied for better readability

### promptMove
Asks the current player for their move:
- Returns raw input string
- Format expected: "e2-d3" or similar notation

### displayMessage
Displays informational messages:
- Turn announcements
- Game status updates

### displayError
Displays error messages:
- Invalid move messages
- Parse errors

### parseMoveInput
Converts string notation to position objects:
- Input: "e2-d3"
- Output: `{ from: { row: 5, col: 4 }, to: { row: 4, col: 5 } }`
- Returns null if format is invalid

## Notation

Moves use algebraic notation:
- Columns: a-h (left to right)
- Rows: 1-8 (bottom to top for red, top to bottom for white)
- Example: "e2-d3" moves from e2 to d3

## Usage

```typescript
import { createUi } from '../ui'

const ui = createUi()
ui.displayBoard(gameState.board)
const input = ui.promptMove(gameState.turn)
const positions = ui.parseMoveInput(input)
```

## Notes

- Depends only on the `types` module
- Pure presentation logic
- No game rules or business logic
