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

  async getUserChats(userPublicKey: string): Promise<ChatModel[]> {
    const chats = await this.prismaService.client.usersOnChats.findMany({
      where: {
        userPublicKey,
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
