import { UserModel } from ".prisma/client";
import { inject, injectable } from "inversify";
import { PrismaService } from "../database/prisma.service";
import { TYPES } from "../types";
import { IUsersRepository } from "./users.repository.interface";

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @inject(TYPES.PrismaService) private prismaService: PrismaService
  ) {}

  async findAllbyUser(publicKey: string): Promise<ChatModel[] | null> {
    return this.prismaService.client.userModel.findMany({
      where: {
        publicKey,
      },
    });
  }
}
