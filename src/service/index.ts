import type { Player, PieceType, Position, Piece, Board, Move, GameState } from '../types';
import { BOARD_SIZE, DIRECTION } from '../config';
import { isValidPosition } from '../utils';

const createEmptyBoard = (): Board => {
  const board: Board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = null;
    }
  }
  return board;
};

const copyBoard = (board: Board): Board => {
  return board.map(row => row.map(piece => (piece ? { ...piece } : null)));
};

export interface GameService {
  isValidMove(gameState: GameState, move: Move): boolean;
  getValidMoves(gameState: GameState): Move[];
  applyMove(gameState: GameState, move: Move): GameState;
  isKingingMove(gameState: GameState, move: Move): boolean;
  checkWin(gameState: GameState): Player | 'draw' | null;
  getCapturedPieces(gameState: GameState, move: Move): Position[];
}

const getPieceAt = (board: Board, pos: Position): Piece | null => {
  if (!isValidPosition(pos)) return null;
  return board[pos.row][pos.col];
};

const isValidSquare = (pos: Position): boolean => {
  return isValidPosition(pos) && (pos.row + pos.col) % 2 === 1;
};

const isOwnPiece = (gameState: GameState, pos: Position): boolean => {
  const piece = getPieceAt(gameState.board, pos);
  return piece !== null && piece.player === gameState.turn;
};

const isOpponentPiece = (gameState: GameState, pos: Position): boolean => {
  const piece = getPieceAt(gameState.board, pos);
  return piece !== null && piece.player !== gameState.turn;
};

const getPieceDirection = (piece: Piece): number => {
  if (piece.type === 'king') return 0;
  return DIRECTION[piece.player];
};

const getNormalMoves = (gameState: GameState, from: Position): Move[] => {
  const piece = getPieceAt(gameState.board, from);
  if (!piece) return [];

  const moves: Move[] = [];
  const directions = piece.type === 'king' ? [-1, 1] : [DIRECTION[piece.player]];

  for (const rowDir of directions) {
    for (const colDir of [-1, 1]) {
      const to: Position = {
        row: from.row + rowDir,
        col: from.col + colDir,
      };

      if (isValidSquare(to) && getPieceAt(gameState.board, to) === null) {
        moves.push({ from, to });
      }
    }
  }

  return moves;
};

const getCaptureMoves = (gameState: GameState, from: Position): Move[] => {
  const piece = getPieceAt(gameState.board, from);
  if (!piece) return [];

  const moves: Move[] = [];
  const directions = piece.type === 'king' ? [-1, 1] : [DIRECTION[piece.player]];

  for (const rowDir of directions) {
    for (const colDir of [-1, 1]) {
      const jumpOver: Position = {
        row: from.row + rowDir,
        col: from.col + colDir,
      };

      const to: Position = {
        row: from.row + 2 * rowDir,
        col: from.col + 2 * colDir,
      };

      if (
        isValidSquare(to) &&
        getPieceAt(gameState.board, jumpOver) !== null &&
        isOpponentPiece(gameState, jumpOver) &&
        getPieceAt(gameState.board, to) === null
      ) {
        moves.push({ from, to, captured: [jumpOver] });
      }
    }
  }

  return moves;
};

const getAllMovesForPosition = (gameState: GameState, from: Position): Move[] => {
  const captureMoves = getCaptureMoves(gameState, from);
  if (captureMoves.length > 0) {
    return captureMoves;
  }
  return getNormalMoves(gameState, from);
};

const getAllMoves = (gameState: GameState): Move[] => {
  let allMoves: Move[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const pos: Position = { row, col };
      if (isOwnPiece(gameState, pos)) {
        const moves = getAllMovesForPosition(gameState, pos);
        allMoves = allMoves.concat(moves);
      }
    }
  }

  const captureMoves = allMoves.filter(m => m.captured && m.captured.length > 0);
  return captureMoves.length > 0 ? captureMoves : allMoves;
};

export const createGameService = (): GameService => {
  const isValidMove = (gameState: GameState, move: Move): boolean => {
    if (!isValidPosition(move.from) || !isValidPosition(move.to)) {
      return false;
    }

    if (!isOwnPiece(gameState, move.from)) {
      return false;
    }

    if (getPieceAt(gameState.board, move.to) !== null) {
      return false;
    }

    const rowDiff = Math.abs(move.to.row - move.from.row);
    const colDiff = Math.abs(move.to.col - move.from.col);

    if (rowDiff === 0 || colDiff === 0 || rowDiff !== colDiff) {
      return false;
    }

    const piece = getPieceAt(gameState.board, move.from);
    if (!piece) return false;

    const directions = piece.type === 'king' ? [-1, 1] : [DIRECTION[piece.player]];

    if (rowDiff === 1) {
      if (piece.type === 'man' && !directions.includes(move.to.row - move.from.row)) {
        return false;
      }
      return true;
    }

    if (rowDiff === 2) {
      const midRow = (move.from.row + move.to.row) / 2;
      const midCol = (move.from.col + move.to.col) / 2;
      const midPos: Position = { row: midRow, col: midCol };

      if (isOpponentPiece(gameState, midPos)) {
        return true;
      }
    }

    return false;
  };

  const getValidMoves = (gameState: GameState): Move[] => {
    return getAllMoves(gameState);
  };

  const applyMove = (gameState: GameState, move: Move): GameState => {
    const newBoard = copyBoard(gameState.board);
    const piece = getPieceAt(gameState.board, move.from);

    if (!piece) {
      return gameState;
    }

    newBoard[move.to.row][move.to.col] = piece;
    newBoard[move.from.row][move.from.col] = null;

    if (move.captured) {
      for (const capturedPos of move.captured) {
        const capturedPiece = getPieceAt(newBoard, capturedPos);
        if (capturedPiece) {
          newBoard[capturedPos.row][capturedPos.col] = null;
        }
      }
    }

    let newPieces = { ...gameState.pieces };
    if (move.captured) {
      newPieces[gameState.turn] += move.captured.length;
    }

    let newTurn: Player = gameState.turn === 'red' ? 'white' : 'red';

    return {
      board: newBoard,
      turn: newTurn,
      pieces: newPieces,
    };
  };

  const isKingingMove = (gameState: GameState, move: Move): boolean => {
    const piece = getPieceAt(gameState.board, move.from);
    if (!piece || piece.type === 'king') return false;

    if (piece.player === 'red' && move.to.row === 0) {
      return true;
    }

    if (piece.player === 'white' && move.to.row === 7) {
      return true;
    }

    return false;
  };

  const checkWin = (gameState: GameState): Player | 'draw' | null => {
    let redPieces = 0;
    let whitePieces = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = gameState.board[row][col];
        if (piece) {
          if (piece.player === 'red') redPieces++;
          if (piece.player === 'white') whitePieces++;
        }
      }
    }

    if (redPieces === 0) return 'white';
    if (whitePieces === 0) return 'red';

    const validMoves = getValidMoves(gameState);
    if (validMoves.length === 0) {
      return 'draw';
    }

    return null;
  };

  const getCapturedPieces = (gameState: GameState, move: Move): Position[] => {
    if (!move.captured) return [];
    return move.captured;
  };

  return {
    isValidMove,
    getValidMoves,
    applyMove,
    isKingingMove,
    checkWin,
    getCapturedPieces,
  };
};
