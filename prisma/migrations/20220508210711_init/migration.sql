/*
  Warnings:

  - You are about to drop the `_ChatModelToUserModel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ChatModelToUserModel";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UsersOnChats" (
    "userId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "chatId"),
    CONSTRAINT "UsersOnChats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsersOnChats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
