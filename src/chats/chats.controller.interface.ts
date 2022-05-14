import { NextFunction, Request, Response } from "express";

export interface IChatController {
  getChatsByUser: (req: Request, res: Response, next: NextFunction) => void;
}
