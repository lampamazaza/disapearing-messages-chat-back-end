import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { BaseController } from "../common/base.controller";
import { MessageCreateDto } from "./dto/message-create.dto";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import "reflect-metadata";
import { IMessageController } from "./messages.controller.interface";
import { IConfigService } from "../config/config.service.interface";
import { IMessageService } from "./messages.service.interface";
import { ValidateMiddleware } from "../common/validate.middleware";
import { HTTPError } from "../errors/http-error.class";
import { IPollingService } from "services/pollingService/polling.interface";
import { AuthGuard } from "../common/auth.guard";

@injectable()
export class MessageController
  extends BaseController
  implements IMessageController
{
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.MessageService) private messagesService: IMessageService,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.PollingSerivce) private pollingService: IPollingService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: "/",
        method: "post",
        func: this.sendMessage,
        middlewares: [
          new ValidateMiddleware(MessageCreateDto),
          new AuthGuard(),
        ],
      },
      {
        path: "/:publicKey",
        method: "get",
        func: this.getMessagesByChat,
        middlewares: [new AuthGuard()],
      },
      {
        path: "/subscribe",
        method: "post",
        func: this.subscribeForMessages,
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async getMessagesByChat(
    { userPublicKey, params: { publicKey } }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const messages =
      await this.messagesService.getMessagesByCorrespondentPublicKey(
        userPublicKey,
        publicKey
      );

    this.ok(res, messages);
  }

  async sendMessage(
    { body, userPublicKey }: Request<{}, {}, MessageCreateDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const message = await this.messagesService.create(body, userPublicKey);
    const messageTo = body.toPublicKey;
    this.pollingService.publish(
      messageTo,
      { [userPublicKey]: [message] },
      (oldData) => {
        return {
          ...oldData,
          ...{
            [message.sender]: [...oldData[message.sender], ...[message]],
          },
        };
      }
    );
    this.ok(res, message);
  }

  async subscribeForMessages(
    { userPublicKey }: Request,
    res: Response,
    next: NextFunction
  ) {
    this.pollingService.subscribe(
      userPublicKey,
      (payload: any) => this.ok(res, payload),
      () => res.status(408)
    );
  }
}
