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
      select: {
        chatId: true,
      },
    });

    result = Promise.all(
      chats.map(async (item) => {
        const [user, lastMessage] = await Promise.all([
          this.prismaService.client.usersOnChats.findFirst({
            where: {
              chatId: item.chatId,
              AND: {
                userPublicKey: {
                  not: userPublicKey,
                },
              },
            },
            include: {
              user: true,
            },
          }),
          this.prismaService.client.messageModel.findFirst({
            where: { chatId: item.chatId },
            orderBy: { sentAt: "desc" },
          }),
        ]);
        item["user"] = user.user;
        item["publicKey"] = user.user.publicKey;
        item["lastMessage"] = lastMessage;
        return item;
      })
    );

    return result;
  }
}
