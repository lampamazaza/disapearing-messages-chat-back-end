import { MessageModel } from ".prisma/client";
import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
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

  async create(message: MessageCreateDto): Promise<Message | null> {
    const newMessage = new Message(
      message.toPublicKey,
      message.chatId,
      message.from,
      message.message
    );

    try {
      await this.messagesRepository.create(newMessage);
      return newMessage;
    } catch (error) {
      return null;
    }
  }

  async getMessagesByCorrespondentPublicKey(
    userPublicKey: string,
    correspondentPublickKey: string
  ): Promise<MessageModel[]> {
    return this.messagesRepository.getMessagesByCorrespondentPublicKey(
      userPublicKey,
      correspondentPublickKey
    );
  }
}
