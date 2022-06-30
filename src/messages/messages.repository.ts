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
      hash = await generateHash(from, to);
      chat = await this.prismaService.client.chatModel.findFirst({
        where: { chatHash: hash },
      });
    }

    if (chat === null) {
      chatExists = false;
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

  async getMessagesByCorrespondentPublicKey(
    userPublicKey: string,
    publicKey: string
  ): Promise<MessageModel[]> {
    const user = await this.prismaService.client.userModel.findFirst({
      where: {
        publicKey,
      },
    });
    if (!user) return null;
    const chatHash = await generateHash(userPublicKey, user.publicKey);

    const chat = await this.prismaService.client.chatModel.findFirst({
      where: {
        chatHash,
      },
    });

    if (chat === null) return [];

    return this.prismaService.client.messageModel.findMany({
      where: { chatId: chat.id },
      orderBy: { sentAt: "asc" },
    });
  }

  async wipeAllMessagesOlderThanTwoDays() {
    return await this.prismaService.client.messageModel.deleteMany({
      where: {
        sentAt: {
          //172800000 - two days in ms
          lte: new Date(new Date().getTime() - 172800000),
        },
      },
    });
  }
}
