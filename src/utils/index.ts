import type { Position, Move, Board } from '../types';

export function positionToNotation(pos: Position): string {
  const colLetter = String.fromCharCode(97 + pos.col);
  const rowNumber = 8 - pos.row;
  return `${colLetter}${rowNumber}`;
}

export function notationToPosition(notation: string): Position | null {
  if (notation.length !== 2) {
    return null;
  }

  const colLetter = notation[0];
  const rowNumber = parseInt(notation[1], 10);

  if (!/[a-h]/.test(colLetter)) {
    return null;
  }

  if (rowNumber < 1 || rowNumber > 8) {
    return null;
  }

  const col = colLetter.charCodeAt(0) - 97;
  const row = 8 - rowNumber;

  return { row, col };
}

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row <= 7 && pos.col >= 0 && pos.col <= 7;
}

export function getDistance(move: Move): number {
  const rowDiff = Math.abs(move.to.row - move.from.row);
  const colDiff = Math.abs(move.to.col - move.from.col);
  const moves = rowDiff > 1 || colDiff > 1;
  return moves ? 2 : 1;
}

export function formatBoardState(board: Board): string {
  let output = '  a b c d e f g h\n';
  output += '  ---------------\n';

  for (let row = 0; row < 8; row++) {
    output += `${8 - row}|`;
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece === null) {
        output += ' .';
      } else if (piece.player === 'red') {
        output += ' R';
      } else {
        output += ' W';
      }
    }
    output += ` |${8 - row}\n`;
  }

  output += '  ---------------\n';
  output += '  a b c d e f g h\n';

  return output;
}
