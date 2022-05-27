import { ChatModel } from "@prisma/client";

export interface IChatsRepository {
  getUserChats: (userPublicKey: string) => Promise<ChatModel[]>;
  getChatById: (id: number) => Promise<ChatModel | null>;
}
