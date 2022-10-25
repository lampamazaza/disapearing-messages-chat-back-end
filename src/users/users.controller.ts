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
import {
  COOKIE_TOKEN_NAME,
  COOKIE_TOKEN_OPTIONS,
  DELETED_COOKIE_VAlUE,
} from "./constants";
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
        path: "/auth/authenticate",
        method: "post",
        func: this.authenticate,
      },
      {
        path: "/auth/authenticationData/:publicKey",
        method: "get",
        func: this.getAuthenticationData,
      },
      {
        path: "/auth/login",
        method: "get",
        func: this.login,
        middlewares: [new AuthGuard()],
      },
      {
        path: "/auth/logout",
        method: "post",
        func: this.logout,
        middlewares: [new AuthGuard()],
      },
      {
        path: "/:alias",
        method: "get",
        func: this.info,
        middlewares: [new AuthGuard()],
      },
      {
        path: "/byPublicKey/:publicKey",
        method: "get",
        func: this.infoByPublicKey,
        middlewares: [new AuthGuard()],
      },
      {
        path: "/:userPublicKeyToUpdate",
        method: "put",
        func: this.updateUser,
        middlewares: [new AuthGuard()],
      },
    ]);
  }

  async updateUser(
    { params: { userPublicKeyToUpdate }, userPublicKey, body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (userPublicKeyToUpdate !== userPublicKey) {
        return next(
          new HTTPError(403, "You can't change other people account")
        );
      }
      const updatedUserInfo = await this.userService.updateUserInfo(
        body,
        userPublicKey
      );
      this.ok(res, updatedUserInfo);
    } catch (error) {
      return next(
        new HTTPError(500, "Failed to update user data", "Users", error.stack)
      );
    }
  }

  async login({ userPublicKey }: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.login(userPublicKey);
      if (!user) {
        return next(new HTTPError(404, "This user doesn't exist"));
      }
      this.ok(res, user);
    } catch (error) {
      return next(new HTTPError(500, "Failed to login", "Auth", error.stack));
    }
  }

  async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie(COOKIE_TOKEN_NAME, DELETED_COOKIE_VAlUE, COOKIE_TOKEN_OPTIONS);
      res.sendStatus(200);
    } catch (error) {
      return next(new HTTPError(500, "Failed to logout", "Auth", error.stack));
    }
  }

  async authenticate(
    {
      body: { decryptedMsg, publicKey },
    }: Request<{}, {}, { decryptedMsg: string; publicKey: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { isSuccessfullyAuthenticated, user } =
        await this.userService.authenticate(decryptedMsg, publicKey);

      if (!isSuccessfullyAuthenticated) {
        return next(new HTTPError(401, "Auth error", "login"));
      }
      const jwt = await this.signJWT(publicKey, this.configService.get("SECRET"));
      res.cookie(COOKIE_TOKEN_NAME, jwt, COOKIE_TOKEN_OPTIONS);
      this.ok(res, {
        user,
      });
    } catch (error) {
      return next(
        new HTTPError(500, "Failed to authenticate", "Auth", error.stack)
      );
    }
  }

  async getAuthenticationData(
    { params: { publicKey } }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.userService.getAuthenticationData(publicKey);
      this.ok(res, result);
    } catch (error) {
      return next(
        new HTTPError(
          500,
          error.message || "Failed to get authentication data",
          "Auth",
          error.stack
        )
      );
    }
  }

  async create(
    { body }: Request<{}, {}, UserCreateDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.userService.createUser(body);
      if (!result) {
        return next(new HTTPError(409, "User with this alias already exist"));
      }
      this.ok(res, result);
    } catch (error) {
      return next(
        new HTTPError(500, "Failed to create a user", "Users", error.stack)
      );
    }
  }

  async info(
    { params: { alias } }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userInfo = await this.userService.getUserInfo(alias);
    if (!userInfo) {
      return next(new HTTPError(404, "User with this alias doesn't exist"));
    }
    this.ok(res, {
      publicKey: userInfo?.publicKey,
      alias: userInfo?.alias,
      name: userInfo?.name,
    });
  }

  async infoByPublicKey(
    { params: { publicKey } }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userInfo = await this.userService.getUserInfoByPublicKey(publicKey);
    if (!userInfo) {
      return next(new HTTPError(404, "User not found"));
    }
    this.ok(res, {
      publicKey: userInfo?.publicKey,
      alias: userInfo?.alias,
      name: userInfo?.name,
    });
  }

  private signJWT(publicKey: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          publicKey,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: "HS256",
          expiresIn: "7 days",
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
