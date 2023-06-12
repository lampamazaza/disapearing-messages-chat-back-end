import { IMiddleware } from "./middleware.interface";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import {
  COOKIE_TOKEN_NAME,
  DELETED_COOKIE_VAlUE,
  COOKIE_TOKEN_OPTIONS,
} from "../users/constants";
import getToken from "../utils/getToken";

export class AuthMiddleware implements IMiddleware {
  constructor(private secret: string) {}

  execute(req: Request, res: Response, next: NextFunction): void {
    if (req.headers.cookie) {
      const token = getToken(req.headers.cookie);
      verify(token, this.secret, (err, payload) => {
        if (err) {
          // Expire cookie if token non valid
          res.cookie(
            COOKIE_TOKEN_NAME,
            DELETED_COOKIE_VAlUE,
            COOKIE_TOKEN_OPTIONS
          );
          next();
        } else if (payload) {
          req.userPublicKey = payload.publicKey;
          next();
        }
      });
    } else {
      next();
    }
  }
}
