import { UsersOnChats, MessageModel } from "../database/models";
import { inject, injectable } from "inversify";
import { SqliteService } from "../database/sqlite.service";
import { TYPES } from "../types";
import { IChatsRepository } from "./chats.repository.interface";

@injectable()
export class ChatsRepository implements IChatsRepository {
  constructor(
    @inject(TYPES.SqliteService) private sqliteService: SqliteService
  ) {}

  async getUserChats(
    userPublicKey: string
  ): Promise<UsersOnChats[] & { lastMessage: MessageModel }> {
    let result;
    let chats = await this.sqliteService.client.all(
      "SELECT chatId, userPublicKey FROM usersOnChats WHERE userPublicKey = ?",
      userPublicKey
    );

    result = Promise.all(
      chats.map(async (item) => {
        const [user, lastMessage] = await Promise.all([
          this.sqliteService.client.get(
            "SELECT users.id, users.publicKey, users.name , users.alias FROM usersOnChats JOIN users ON usersOnChats.userPublicKey = users.publicKey  WHERE chatId = ? and userPublicKey  !=  ?",
            [item.chatId, userPublicKey]
          ),
          this.sqliteService.client.get(
            "SELECT * FROM messages WHERE chatId = ? ORDER BY sentAt DESC  LIMIT 1",
            item.chatId
          ),
        ]);
        item["user"] = user;
        item["publicKey"] = user.publicKey;
        item["lastMessage"] = lastMessage;
        return item;
      })
    );

    return result;
  }
}
