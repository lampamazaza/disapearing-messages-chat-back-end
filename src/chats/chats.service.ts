import { ChatModel } from ".prisma/client";
import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
// import { UserLoginDto } from "./dto/user-login.dto";
import { UserCreateDto } from "./dto/chat-create.dto";
import { Chat } from "./chat.entity";
import { IChatsRepository } from "./chats.repository.interface";
import { IChatService } from "./chats.service.interface";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.ChatsRepository) private chatsRepository: IChatsRepository
  ) {}

  async getUserChats(userPublicKey: string): Promise<ChatModel[]> {
    return this.chatsRepository.getUserChats(userPublicKey);
  }
  async getChatById(id: number): Promise<ChatModel | null> {
    return this.chatsRepository.getChatById(id);
  }
}
