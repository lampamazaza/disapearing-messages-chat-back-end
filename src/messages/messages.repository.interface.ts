import { MessageModel } from "prisma/prisma-client";
export interface IMessagesRepository {
  create: (message: any) => Promise<any>;
  getMessagesByCorrespondentPublicKey: (
    userPublicKey: string,
    correspondentPublickKey: string
  ) => Promise<MessageModel[]>;
}
