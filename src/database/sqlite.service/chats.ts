export function getCreateChats() {
  return `CREATE TABLE IF NOT EXISTS "chats" (
    "id"	INTEGER NOT NULL UNIQUE,
    "chatHash"  TEXT NOT NULL UNIQUE, 
    PRIMARY KEY("id" AUTOINCREMENT)
  );`;
}
