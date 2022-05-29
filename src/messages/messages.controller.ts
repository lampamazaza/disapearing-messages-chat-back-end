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

@injectable()
export class MessageController
  extends BaseController
  implements IMessageController
{
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.MessageService) private messagesService: IMessageService,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: "/send",
        method: "post",
        func: this.sendMessage,
        middlewares: [new ValidateMiddleware(MessageCreateDto)],
      },
      {
        path: "/:correspondentPublickKey",
        method: "get",
        func: this.getMessagesByChat,
        // middlewares: [new AuthGuard()],
      },
      // {
      //   path: "/subscribe",
      //   method: "post",
      //   // func: this.getMessagesByUser,
      //   // middlewares: [new AuthGuard()],
      // },
    ]);
  }

  async getMessagesByChat(
    { userPublicKey, params: { correspondentPublickKey } }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const messages =
      await this.messagesService.getMessagesByCorrespondentPublicKey(
        userPublicKey,
        correspondentPublickKey
      );

    if (!messages) {
      return next(
        new HTTPError(
          404,
          "There are no messages in this chat, or chat doesn't exist"
        )
      );
    }
    this.ok(res, messages);
  }

  async sendMessage(
    { body }: Request<{}, {}, MessageCreateDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const message = await this.messagesService.create(body);
    this.ok(res, message);
  }
}
