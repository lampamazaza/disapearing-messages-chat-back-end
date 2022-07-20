import { ChatModel, UsersOnChats } from "@prisma/client";

export interface IChatService {
  getUserChats: (userPublicKey: string) => Promise<UsersOnChats[]>;
}
