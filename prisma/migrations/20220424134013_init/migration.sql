-- CreateTable
CREATE TABLE "UserModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alias" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MessageModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sentAt" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,
    CONSTRAINT "MessageModel_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chatHash" TEXT NOT NULL,
    "lastMessageId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatModelToUserModel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "ChatModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "UserModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_publicKey_key" ON "UserModel"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_alias_key" ON "UserModel"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "ChatModel_chatHash_key" ON "ChatModel"("chatHash");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatModelToUserModel_AB_unique" ON "_ChatModelToUserModel"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatModelToUserModel_B_index" ON "_ChatModelToUserModel"("B");
