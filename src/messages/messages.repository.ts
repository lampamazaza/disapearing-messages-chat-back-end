import { Message } from "./message.entity";
import { CHAT_TYPE, MessageModel } from "../database/models";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IMessagesRepository } from "./messages.repository.interface";
import generateHash from "../utils/generateHash";
import { SqliteService } from "../database/sqlite.service";

@injectable()
export class MessagesRepository implements IMessagesRepository {
  constructor(
    @inject(TYPES.SqliteService) private sqliteService: SqliteService
  ) {}

  async create({
    to,
    message,
    chatId,
    from,
  }: Message): Promise<MessageModel | null> {
    let chat = null;
    let chatExists = true;
    let hash = "";
    if (chatId) {
      chat = await this.sqliteService.client.get(
        "SELECT * FROM chats WHERE id = ?",
        chatId
      );
    }

    if (!chat) {
      hash = await generateHash(from, to);
      chat = await this.sqliteService.client.get(
        "SELECT * FROM chats WHERE chatHash = ?",
        hash
      );
    }

    if (!chat) {
      chatExists = false;
    }

    if (!chatExists) {
      chat = await this.sqliteService.client.get(
        "INSERT INTO chats (chatHash,type) VALUES (?,?) RETURNING *;",
        [hash, CHAT_TYPE.DIALOG]
      );

      await Promise.all([
        this.sqliteService.client.run(
          "INSERT INTO usersOnChats (chatId, userPublicKey) VALUES (?,?);",
          [chat.id, from]
        ),
        this.sqliteService.client.run(
          "INSERT INTO usersOnChats (chatId, userPublicKey) VALUES (?,?);",
          [chat.id, to]
        ),
      ]);
    }

    return this.sqliteService.client.get(
      "INSERT INTO messages (sender, text, chatId) VALUES (?,?,?) RETURNING *;",
      [from, message, chat.id]
    );
  }

  async getMessagesByCorrespondentPublicKey(
    userPublicKey: string,
    publicKey: string
  ): Promise<MessageModel[]> {
    const user = await this.sqliteService.client.get(
      "SELECT * FROM users WHERE publicKey = ?",
      publicKey
    );

    if (!user) return null;
    const chatHash = await generateHash(userPublicKey, user.publicKey);

    const chat = await this.sqliteService.client.get(
      "SELECT * FROM chats WHERE chatHash = ?",
      chatHash
    );

    if (!chat) return [];

    return this.sqliteService.client.all(
      "SELECT * FROM messages WHERE chatId = ? ORDER BY sentAt ASC",
      chat.id
    );
  }

  async wipeAllMessagesOlderThanTwoDays() {
    const twoDaysBefore = new Date(new Date().getTime() - 172800000);
    const { changes } = await this.sqliteService.client.run(
      "DELETE FROM messages WHERE sentAt < ?",
      twoDaysBefore.toISOString()
    );
    return { count: changes };
  }
}
