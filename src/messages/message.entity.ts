export class Message {
  constructor(
    private readonly _to: string,
    private readonly _chatId: number | null,
    private readonly _from: string,
    private readonly _message: string
  ) {
    this._to = _to;
    this._chatId = _chatId;
    this._from = _from;
    this._message = _message;
  }

  get to(): string {
    return this._to;
  }
  get message(): string {
    return this._message;
  }
  get chatId(): number | null {
    return this._chatId;
  }
  get from(): string {
    return this._from;
  }
}
