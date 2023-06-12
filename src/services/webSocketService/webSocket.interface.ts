import { MessageModel } from "../../database/models";
export interface IWebSocketService {
  publishPrivateMessage(to: string, message: MessageModel);
}
