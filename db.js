import Database from "better-sqlite3";

const db = new Database(process.env.DB_PATH ?? "trivia.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
    guild_id TEXT NOT NULL, 
    user_id TEXT NOT NULL,
    points   INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (guild_id, user_id)
  )
`);

const addStmt = db.prepare(`
    INSERT INTO scores (guild_id, user_id, points) VALUES (?, ?, 1)
  ON CONFLICT (guild_id, user_id) DO UPDATE SET points = points + 1
`);
const topStmt = db.prepare(`
  SELECT user_id, points FROM scores
  WHERE guild_id = ?
  ORDER BY points DESC
  LIMIT ?
`);

export function addPoint(guildId, userId) {
    addStmt.run(guildId, userId);
}

export function getTop(guildId, limit = 10) {
    return topStmt.all(guildId, limit);
}
    