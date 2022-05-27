import { ChatModel } from "@prisma/client";

export interface IChatService {
  getUserChats: (userPublicKey: string) => Promise<ChatModel[]>;
  getChatById: (id: number) => Promise<ChatModel | null>;
}
