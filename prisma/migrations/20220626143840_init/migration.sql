-- CreateTable
CREATE TABLE "UserModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alias" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ChatModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chatHash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UsersOnChats" (
    "userPublicKey" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,

    PRIMARY KEY ("userPublicKey", "chatId"),
    CONSTRAINT "UsersOnChats_userPublicKey_fkey" FOREIGN KEY ("userPublicKey") REFERENCES "UserModel" ("publicKey") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsersOnChats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MessageModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" INTEGER NOT NULL,
    CONSTRAINT "MessageModel_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_publicKey_key" ON "UserModel"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_alias_key" ON "UserModel"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "ChatModel_chatHash_key" ON "ChatModel"("chatHash");
