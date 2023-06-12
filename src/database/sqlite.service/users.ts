export function getCreateTable() {
  return `CREATE TABLE IF NOT EXISTS "users" (
    "id"	 INTEGER NOT NULL,
    "publicKey"	String NOT NULL UNIQUE,
    "name"	String NOT NULL,
    "alias"	String NOT NULL UNIQUE,
    PRIMARY KEY("id" AUTOINCREMENT)
  );`;
}
export function getCreateUsersOnChats() {
  return `CREATE TABLE IF NOT EXISTS  "usersOnChats" (
    "userPublicKey" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,

    CONSTRAINT "usersOnChats_userPublicKey_fkey" FOREIGN KEY ("userPublicKey") REFERENCES "users" ("publicKey") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "usersOnChats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )
    `;
}
