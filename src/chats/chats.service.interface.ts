import { ChatModel } from "@prisma/client";

export interface IChatService {
  getUserChats: (id: number) => Promise<ChatModel[]>;
  getChatById: (id: number) => Promise<ChatModel | null>;
}
