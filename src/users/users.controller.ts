import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import "reflect-metadata";
import { IUserController } from "./users.controller.interface";
import { UserCreateDto } from "./dto/user-create.dto";
import { ValidateMiddleware } from "../common/validate.middleware";
import { sign } from "jsonwebtoken";
import { IConfigService } from "../config/config.service.interface";
import { IUserService } from "./users.service.interface";
import { AuthGuard } from "../common/auth.guard";

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    super(loggerService);
    this.bindRoutes([
      {
        path: "/",
        method: "post",
        func: this.create,
        middlewares: [new ValidateMiddleware(UserCreateDto)],
      },
      {
        path: "/login",
        method: "post",
        func: this.login,
      },
      {
        path: "/:user",
        method: "get",
        func: this.info,
        // middlewares: [new AuthGuard()],
      },
    ]);
  }

  async login(
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // const result = await this.userService.validateUser(req.body);
    // if (!result) {
    //   return next(new HTTPError(401, "Auth error", "login"));
    // }
    // const jwt = await this.signJWT(
    //   req.body.email,
    //   this.configService.get("SECRET")
    // );
    this.ok(res, { jwt: "jwt" });
  }

  async create(
    { body }: Request<{}, {}, UserCreateDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const result = await this.userService.createUser(body);
    if (!result) {
      return next(new HTTPError(422, "User already exists"));
    }
    this.ok(res, {
      publicKey: result.publicKey,
      alias: result.alias,
      name: result.name,
    });
  }

  async info(
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

  private signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: "HS256",
        },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token as string);
        }
      );
    });
  }
}
