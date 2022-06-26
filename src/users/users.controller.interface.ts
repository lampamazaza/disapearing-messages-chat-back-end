import { NextFunction, Request, Response } from "express";

export interface IUserController {
  // login: (req: Request, res: Response, next: NextFunction) => void;
  create: (req: Request, res: Response, next: NextFunction) => void;
  info: (req: Request, res: Response, next: NextFunction) => void;
  infoByPublicKey: (req: Request, res: Response, next: NextFunction) => void;
  authenticate: (
    req: Request<{}, {}, { decryptedMsg: number[]; publicKey: string }>,
    res: Response,
    next: NextFunction
  ) => void;
}
