import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { IExeptionFilter } from "./exeption.filter.interface";
import { HTTPError } from "./http-error.class";
import "reflect-metadata";

@injectable()
export class ExeptionFilter implements IExeptionFilter {
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

  catch(
    err: Error | HTTPError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    if (err instanceof HTTPError) {
      this.logger.error(
        `[${err.context}] Error ${err.statusCode}: ${err.message}${err.stack ? `\n${err.stack}`: ""}`
      );
      res.status(err.statusCode).send({ message: err.message });
    } else {
      this.logger.error(`${err.message}\n${err.stack}`);
      res.status(500).send({ err: err.message });
    }
  }
}
