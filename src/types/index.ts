export type Player = 'red' | 'white';

export type PieceType = 'man' | 'king';

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  player: Player;
  type: PieceType;
}

export type Board = (Piece | null)[][];

export interface Move {
  from: Position;
  to: Position;
  captured?: Position[];
}

export interface GameState {
  board: Board;
  turn: Player;
  pieces: {
    red: number;
    white: number;
  };
}

export type GameLog = Move[];
