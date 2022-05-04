export class Chat {
  constructor(
    private readonly _id: string,
    private readonly _chatHash: string,
    private readonly _lastMessageId: string
    private readonly _users: string
    private readonly _Message: string
  ) {
    this._publicKey = _publicKey;
    this._name = _name;
    this._alias = _alias;
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
