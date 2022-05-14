import { ChatModel } from "@prisma/client";

export interface IChatsRepository {
  getUserChats: (id: number) => Promise<ChatModel[]>;
  getChatById: (id: number) => Promise<ChatModel | null>;
}
