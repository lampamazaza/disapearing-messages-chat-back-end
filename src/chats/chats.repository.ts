import { UsersOnChats, ChatModel, MessageModel } from ".prisma/client";
import { inject, injectable } from "inversify";
import { PrismaService } from "../database/prisma.service";
import { TYPES } from "../types";
import { IChatsRepository } from "./chats.repository.interface";

@injectable()
export class ChatsRepository implements IChatsRepository {
  constructor(
    @inject(TYPES.PrismaService) private prismaService: PrismaService
  ) {}

  async getUserChats(
    userPublicKey: string
  ): Promise<UsersOnChats[] & { lastMessage: MessageModel }> {
    let result;
    let chats = await this.prismaService.client.usersOnChats.findMany({
      where: {
        userPublicKey,
      },
      include: {
        user: true,
      },
    });

    result = Promise.all(
      chats.map(async (item) => {
        item["lastMessage"] =
          await this.prismaService.client.messageModel.findFirst({
            where: { chatId: item.chatId },
            orderBy: { sentAt: "asc" },
          });
        return item;
      })
    );

    return result;
  }
  async getChatById(id: number): Promise<ChatModel | null> {
    const chat = await this.prismaService.client.chatModel.findUnique({
      where: {
        id,
      },
    });

    if (!chat) return null;

    return chat;
  }
}
