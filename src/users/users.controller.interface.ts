import { NextFunction, Request, Response } from "express";
export interface IUserController {
  create: (req: Request, res: Response, next: NextFunction) => void;
  info: (req: Request, res: Response, next: NextFunction) => void;
  infoByPublicKey: (req: Request, res: Response, next: NextFunction) => void;
  authenticate: (
    req: Request<{}, {}, { decryptedMsg: string; publicKey: string }>,
    res: Response,
    next: NextFunction
  ) => void;
  login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
