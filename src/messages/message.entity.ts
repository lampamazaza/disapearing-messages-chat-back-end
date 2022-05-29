export class Message {
  constructor(
    readonly to: string,
    readonly chatId: number | null,
    readonly from: string,
    readonly message: string
  ) {
    this.to = to;
    this.chatId = chatId;
    this.from = from;
    this.message = message;
  }
}
