import { MessageModel } from "@prisma/client";
import { User } from "../users/user.entity";
export class Chat {
  constructor(
    private readonly _id: string,
    private readonly _chatHash: string,
    private readonly _lastMessage: MessageModel,
    private readonly _correspondent: User
  ) {
    this._id = _id;
    this._chatHash = _chatHash;
    this._lastMessage = _lastMessage;
    this._correspondent = _correspondent;
  }

  get name(): string {
    return this._id;
  }
  get chatHash(): string {
    return this._chatHash;
  }
  get lastMessage(): MessageModel {
    return this._lastMessage;
  }
  get correspondent(): User {
    return this._correspondent;
  }
}

// id            Int            @id @default(autoincrement())
// chatHash      String         @unique
// lastMessageId Int
// Users         UserModel[]
// Message       MessageModel[]
