import { UsersOnChats, MessageModel } from "../database/models";

export interface IChatsRepository {
  getUserChats: (
    userPublicKey: string
  ) => Promise<UsersOnChats[] & { lastMessage: MessageModel }>;
}
