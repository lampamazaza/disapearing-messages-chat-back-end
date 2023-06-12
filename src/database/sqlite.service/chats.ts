export function getCreateChats() {
  return `CREATE TABLE IF NOT EXISTS "chats" (
    "id"	INTEGER NOT NULL UNIQUE,
    "chatHash"  TEXT UNIQUE, 
    "type" INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
  );`;
}
