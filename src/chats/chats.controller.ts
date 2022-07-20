import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { BaseController } from "../common/base.controller";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import "reflect-metadata";
import { IChatController } from "./chats.controller.interface";
import { IConfigService } from "../config/config.service.interface";
import { IChatService } from "./chats.service.interface";
import { AuthGuard } from "../common/auth.guard";
import { HTTPError } from "../errors/http-error.class";

@injectable()
export class ChatController extends BaseController implements IChatController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.ChatService) private chatsService: IChatService,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: "/",
        method: "get",
        func: this.getChatsByUser,
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async getChatsByUser(
    { userPublicKey }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userChats = await this.chatsService.getUserChats(userPublicKey);
      this.ok(res, userChats);
    } catch (error) {
      return next(new HTTPError(500, `Failed to get chats for a user ${userPublicKey}`, "Chats", error.stack));
    }
  }

}
