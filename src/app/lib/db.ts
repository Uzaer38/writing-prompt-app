// lib/db.ts
import { Database } from 'sqlite3';
import { open } from 'sqlite';

let db: any = null;

async function getDb() {
  if (!db) {
    db = await open({
      filename: './prompts.db',
      driver: Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS prompts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS responses (
        id TEXT PRIMARY KEY,
        promptId TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (promptId) REFERENCES prompts(id)
      );
    `);
  }
  return db;
}

export { getDb };