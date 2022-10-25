import { IConfigService } from "./config.service.interface";
import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    if (process.env.NODE_ENV === "development") {
      let result: any = config();
      if (result.error) {
        this.logger.error(
          "[ConfigService] Failed to read .env file, it is either missing of corrupted"
        );
        process.exit(1);
      }
      this.config = result.parsed as DotenvParseOutput;
    } else {
      this.config = {
        SECRET: process.env.SECRET,
        CORS_DEV_ALLOW: process.env.CORS_DEV_ALLOW,
        PORT: process.env.PORT,
      };
    }

    if (this.config.SECRET === undefined || this.config.PORT === undefined) {
      this.logger.error("[ConfigService] SECRET and PORT envs are missing");
      process.exit(1);
    } else {
      this.logger.log("[ConfigService] Dot Env config loaded");
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
