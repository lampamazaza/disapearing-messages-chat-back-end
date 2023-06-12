import { inject, injectable } from "inversify";
import { ILogger } from "../../logger/logger.interface";
import { IConfigService } from "../../config/config.service.interface";
import { TYPES } from "../../types";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { getCreateTable, getCreateUsersOnChats } from "./users";
import { createMessagesTable } from "./messages";
import { getCreateChats } from "./chats";

@injectable()
export class SqliteService {
  client: any;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {}

  async connect(): Promise<void> {
    try {
      sqlite3.verbose();
      const db = await open({
        filename: this.configService.get("DB_PATH"),
        driver: sqlite3.Database,
      });
      this.client = db;
      await this.client.run(getCreateTable());
      await this.client.run(createMessagesTable());
      await this.client.run(getCreateChats());
      await this.client.run(getCreateUsersOnChats());

      this.logger.log("[SqliteService] Started");
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error("[SqliteService] Failed to start: " + e.message);
      }
    }
  }

  async disconnect(): Promise<void> {
    this.logger.log("[SqliteService] Stopped");
  }
}
