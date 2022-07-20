import { ChatModel, UsersOnChats, MessageModel } from "@prisma/client";

export interface IChatsRepository {
  getUserChats: (
    userPublicKey: string
  ) => Promise<UsersOnChats[] & { lastMessage: MessageModel }>;
}
