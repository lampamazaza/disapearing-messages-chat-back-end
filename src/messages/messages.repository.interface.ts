import { MessageModel } from "../database/models";
import { Message } from "./message.entity";
export interface IMessagesRepository {
  create: (message: Message) => Promise<MessageModel>;
  getMessagesByCorrespondentPublicKey: (
    userPublicKey: string,
    alias: string
  ) => Promise<MessageModel[]>;
  wipeAllMessagesOlderThanTwoDays: () => Promise<{
    count: number;
  }>;
}
