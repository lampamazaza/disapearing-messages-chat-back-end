import { ChatModel, UsersOnChats } from "../database/models";

export interface IChatService {
  getUserChats: (userPublicKey: string) => Promise<UsersOnChats[]>;
}
