import { MessageModel } from "../database/models";
import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
import { MessageCreateDto } from "./dto/message-create.dto";
import { IMessagesRepository } from "./messages.repository.interface";
import { IMessageService } from "./messages.service.interface";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.MessagesRepository)
    private messagesRepository: IMessagesRepository
  ) {}

  async create(
    { toPublicKey, chatId, message }: MessageCreateDto,
    userPublicKey: string
  ): Promise<MessageModel | null> {
    try {
      return this.messagesRepository.create({
        to: toPublicKey,
        message,
        chatId,
        from: userPublicKey,
      });
    } catch (error) {
      return null;
    }
  }

  async getMessagesByCorrespondentPublicKey(
    userPublicKey: string,
    publicKey: string
  ): Promise<MessageModel[]> {
    return this.messagesRepository.getMessagesByCorrespondentPublicKey(
      userPublicKey,
      publicKey
    );
  }
}
