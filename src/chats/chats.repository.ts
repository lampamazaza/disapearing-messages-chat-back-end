import { ChatModel } from ".prisma/client";
import { inject, injectable } from "inversify";
import { PrismaService } from "../database/prisma.service";
import { TYPES } from "../types";
import { IChatsRepository } from "./chats.repository.interface";

@injectable()
export class ChatsRepository implements IChatsRepository {
  constructor(
    @inject(TYPES.PrismaService) private prismaService: PrismaService
  ) {}

  async getUserChats(id: number): Promise<ChatModel[]> {
    const chats = await this.prismaService.client.usersOnChats.findMany({
      where: {
        userId: id,
      },
      include: {
        chat: true,
      },
    });

    return chats.map(({ chat }) => chat);
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
