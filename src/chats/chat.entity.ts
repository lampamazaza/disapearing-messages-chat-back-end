import { MessageModel } from "@prisma/client";
import { User } from "../users/user.entity";
export class Chat {
  constructor(
    readonly id: string,
    readonly correspondent: User // readonly lastMessage: MessageModel
  ) {
    this.id = id;
    this.correspondent = correspondent;
    // this.lastMessage = lastMessage;
  }
}
