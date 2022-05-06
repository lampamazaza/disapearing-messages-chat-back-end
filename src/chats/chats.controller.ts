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
import { IUserService } from "./users.service.interface";
import { AuthGuard } from "../common/auth.guard";

@injectable()
export class ChatController extends BaseController implements IChatController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: "/",
        method: "get",
        func: this.get,
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async get(
    { params: { user } }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userInfo = await this.userService.getUserInfo(user);
    if (!userInfo) {
      return next(new HTTPError(404, "User not found"));
    }
    this.ok(res, {
      publicKey: userInfo?.publicKey,
      alias: userInfo?.alias,
      name: userInfo?.name,
    });
  }
}
