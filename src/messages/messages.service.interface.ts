// import { ChatModel } from "@prisma/client";

export interface IMessageService {
  create: (message: any) => Promise<any>;
}
