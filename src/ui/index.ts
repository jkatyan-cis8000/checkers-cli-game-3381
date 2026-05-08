import type { Board, Piece, Position, Player } from '../types';
import { notationToPosition } from '../utils';

export interface Ui {
  displayBoard(board: Board): void
  promptMove(player: Player): string
  displayMessage(message: string): void
  displayError(message: string): void
  parseMoveInput(input: string): { from: Position; to: Position } | null
}

function getPieceSymbol(piece: Piece): string {
  if (piece.player === 'red') {
    return piece.type === 'man' ? 'r' : 'R';
  } else {
    return piece.type === 'man' ? 'w' : 'W';
  }
}

export class CliUi implements Ui {
  displayBoard(board: Board): void {
    console.log('');
    console.log('  a b c d e f g h');
    console.log('  ┌─┬─┬─┬─┬─┬─┬─┬─┐');

    for (let row = 0; row < 8; row++) {
      process.stdout.write(`${8 - row}│`);
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece === null) {
          process.stdout.write(' ');
        } else {
          process.stdout.write(getPieceSymbol(piece));
        }
        process.stdout.write('│');
      }
      console.log(` ${8 - row}`);

      if (row < 7) {
        console.log('  ├─┼─┼─┼─┼─┼─┼─┼─┤');
      }
    }

    console.log('  └─┴─┴─┴─┴─┴─┴─┴─┘');
    console.log('  a b c d e f g h');
    console.log('');
  }

  promptMove(player: Player): string {
    const promptText = player === 'red' ? 'Red' : 'White';
    process.stdout.write(`${promptText}'s move (e.g., e2-d3): `);
    return '';
  }

  displayMessage(message: string): void {
    console.log(message);
  }

  displayError(message: string): void {
    console.log(`Error: ${message}`);
  }

  parseMoveInput(input: string): { from: Position; to: Position } | null {
    const trimmed = input.trim();
    if (!trimmed.includes('-')) {
      return null;
    }

    const parts = trimmed.split('-');
    if (parts.length !== 2) {
      return null;
    }

    const fromPos = notationToPosition(parts[0].trim());
    const toPos = notationToPosition(parts[1].trim());

    if (!fromPos || !toPos) {
      return null;
    }

    return { from: fromPos, to: toPos };
  }
}

export function createUi(): Ui {
  return new CliUi();
}
