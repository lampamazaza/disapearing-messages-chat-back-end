import { MessageModel } from "prisma/prisma-client";
import { Message } from "./message.entity";
export interface IMessagesRepository {
  create: (message: Message) => Promise<MessageModel>;
  getMessagesByCorrespondentPublicKey: (
    userPublicKey: string,
    correspondentPublickKey: string
  ) => Promise<MessageModel[]>;
}
