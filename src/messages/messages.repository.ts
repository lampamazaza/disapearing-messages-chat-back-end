import { Message } from "./message.entity";
import { MessageModel } from "prisma/prisma-client";
import { inject, injectable } from "inversify";
import { PrismaService } from "../database/prisma.service";
import { TYPES } from "../types";
import { IMessagesRepository } from "./messages.repository.interface";
import generateHash from "../utils/generateHash";
@injectable()
export class MessagesRepository implements IMessagesRepository {
  constructor(
    @inject(TYPES.PrismaService) private prismaService: PrismaService
  ) {}

  async create({
    to,
    message,
    chatId,
    from,
  }: Message): Promise<MessageModel | null> {
    let chat = null;
    let chatExists = true;
    let hash = "";
    if (chatId) {
      chat = await this.prismaService.client.chatModel.findFirst({
        where: { id: chatId },
      });
    }

    if (chat === null) {
      hash = await generateHash(from + to);
      chat = await this.prismaService.client.chatModel.findFirst({
        where: { chatHash: hash },
      });
    }

    if (chat === null) {
      chatExists = false;
    }

    if (chatExists) {
      const usersIds = await this.prismaService.client.usersOnChats.findMany({
        where: { chatId: chat.id },
      });

      const userMaps = {
        [usersIds[0].userPublicKey]: true,
        [usersIds[1].userPublicKey]: true,
      };

      if (!userMaps[from] || !userMaps[to]) {
        throw new Error("You are not a participant of this chat");
      }
    }

    if (!chatExists) {
      chat = await this.prismaService.client.chatModel.create({
        data: {
          chatHash: hash,
        },
      });

      await Promise.all([
        this.prismaService.client.usersOnChats.create({
          data: {
            chatId: chat.id,
            userPublicKey: from,
          },
        }),
        this.prismaService.client.usersOnChats.create({
          data: {
            chatId: chat.id,
            userPublicKey: to,
          },
        }),
      ]);
    }

    return await this.prismaService.client.messageModel.create({
      data: {
        sender: from,
        text: message,
        chat: {
          connect: {
            id: chat.id,
          },
        },
      },
    });
  }
}
