export class Chat {
  constructor(
    private readonly _id: string,
    private readonly _chatHash: string,
    private readonly _lastMessage: Message
    private readonly _users: string
  ) {
    this._id = _id;
    this._chatHash = _chatHash;
    this._lastMessage= _lastMessage;
    this._users = _users;
  }

  get name(): string {
    return this._name;
  }
  get publicKey(): string {
    return this._publicKey;
  }
  get alias(): string {
    return this._alias;
  }
}

// id            Int            @id @default(autoincrement())
// chatHash      String         @unique
// lastMessageId Int
// Users         UserModel[]
// Message       MessageModel[]
