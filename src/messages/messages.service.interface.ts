import { MessageCreateDto } from "./dto/message-create.dto";
import { MessageModel } from "../database/models";

export interface IMessageService {
  create: (
    message: MessageCreateDto,
    userPublicKey: string
  ) => Promise<MessageModel | null>;
  getMessagesByCorrespondentPublicKey: (
    userPublicKey: string,
    publicKey: string
  ) => Promise<MessageModel[]>;
}
