import { MessageModel } from ".prisma/client";
import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
// import { UserLoginDto } from "./dto/user-login.dto";
import { MessageCreateDto } from "./dto/message-create.dto";
import { Message } from "./message.entity";
import { IMessagesRepository } from "./messages.repository.interface";
import { IMessageService } from "./messages.service.interface";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.MessagesRepository)
    private messagesRepository: IMessagesRepository
  ) {}

  async create(message: MessageCreateDto): Promise<any> {
    const newMessage = new Message(
      message.toPublicKey,
      message.chatId,
      message.from,
      message.message
    );
    return this.messagesRepository.create(newMessage);
  }
}
