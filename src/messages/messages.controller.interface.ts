import { NextFunction, Request, Response } from "express";

export interface IMessageController {
  sendMessage: (req: Request, res: Response, next: NextFunction) => void;
  // subscribe: (req: Request, res: Response, next: NextFunction) => void;
  // get: (req: Request, res: Response, next: NextFunction) => void;
}
