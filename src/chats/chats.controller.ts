import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import "reflect-metadata";
import { IChatController } from "./chats.controller.interface";
import { UserCreateDto } from "./dto/user-create.dto";
import { ValidateMiddleware } from "../common/validate.middleware";
import { sign } from "jsonwebtoken";
import { IConfigService } from "../config/config.service.interface";
import { IChatService } from "./chats.service.interface";
import { AuthGuard } from "../common/auth.guard";

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
        path: "/chatsByUserId/:userid",
        method: "get",
        func: this.getChatsByUser,
        // middlewares: [new AuthGuard()],
      },
      {
        path: "/:chatId",
        method: "get",
        func: this.getChatById,
        // middlewares: [new AuthGuard()],
      },
    ]);
  }

  async getChatsByUser(
    { params: { userid } }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userChats = await this.chatsService.getUserChats(+userid);
    this.ok(res, userChats);
  }

  async getChatById(
    { params: { chatId } }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const chat = await this.chatsService.getChatById(+chatId);
    if (!chat) {
      return next(new HTTPError(404, "Chat not found"));
    }
    this.ok(res, chat);
  }
}
