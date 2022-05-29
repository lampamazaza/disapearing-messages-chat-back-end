import { Message } from "./message.entity";
import { MessageModel } from ".prisma/client";

export interface IMessageService {
  create: (message: any) => Promise<Message | null>;
  getMessagesByCorrespondentPublicKey: (
    userPublicKey: string,
    correspondentPublickKey: string
  ) => Promise<MessageModel[]>;
}
