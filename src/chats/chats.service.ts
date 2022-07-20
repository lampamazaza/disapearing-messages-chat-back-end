import {  UsersOnChats } from ".prisma/client";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IChatsRepository } from "./chats.repository.interface";
import { IChatService } from "./chats.service.interface";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ChatsRepository) private chatsRepository: IChatsRepository
  ) {}

  async getUserChats(userPublicKey: string): Promise<UsersOnChats[]> {
    return this.chatsRepository.getUserChats(userPublicKey);
  }
}
