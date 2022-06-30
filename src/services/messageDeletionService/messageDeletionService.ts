import { inject, injectable } from "inversify";
import { IMessageDeletionService } from "./messageDeletionService.interface";
import { IMessagesRepository } from "../../messages/messages.repository.interface";
import cron from "node-cron";
import { TYPES } from "../../types";
import "reflect-metadata";
import { ILogger } from "logger/logger.interface";

@injectable()
export class MessageDeletionService implements IMessageDeletionService {
  constructor(
    @inject(TYPES.MessagesRepository)
    private messagesRepository: IMessagesRepository,
    @inject(TYPES.ILogger)
    private logger: ILogger
  ) {}
  async init() {
    //“At every minute past hour 0.”
    cron.schedule("* 0 * * *", async () => {
      this.wipeAllMessagesOlderThanTwoDay();
    });
  }

  async wipeAllMessagesOlderThanTwoDay() {
    const now = new Date();
    try {
      const { count } =
        await this.messagesRepository.wipeAllMessagesOlderThanTwoDays();
      this.logger.log(`Deleted ${count} messages at ${now.toUTCString()}`);
    } catch (error) {
      this.logger.error(`Failed to delete messages at ${now.toUTCString()}`);
    }
  }
}
