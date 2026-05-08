import * as fs from 'fs';
import * as path from 'path';
import { GameState } from '../types/index.js';

export interface GameRepo {
  save(gameState: GameState, filename?: string): Promise<void>;
  load(filename?: string): Promise<GameState | null>;
  listSaves(): Promise<string[]>;
}

export class InMemoryRepo implements GameRepo {
  private gameState: GameState | null = null;

  async save(gameState: GameState, filename?: string): Promise<void> {
    this.gameState = gameState;
  }

  async load(filename?: string): Promise<GameState | null> {
    return this.gameState;
  }

  async listSaves(): Promise<string[]> {
    return ['memory'];
  }
}

export class FileRepo implements GameRepo {
  private savesDir: string;

  constructor(savesDir: string = 'saves') {
    this.savesDir = savesDir;
  }

  async save(gameState: GameState, filename: string = 'game.json'): Promise<void> {
    const filePath = path.join(this.savesDir, filename);
    await fs.promises.mkdir(this.savesDir, { recursive: true });
    await fs.promises.writeFile(filePath, JSON.stringify(gameState, null, 2), 'utf-8');
  }

  async load(filename: string = 'game.json'): Promise<GameState | null> {
    const filePath = path.join(this.savesDir, filename);
    try {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async listSaves(): Promise<string[]> {
    try {
      const files = await fs.promises.readdir(this.savesDir);
      return files.filter((file) => file.endsWith('.json'));
    } catch {
      return [];
    }
  }
}
