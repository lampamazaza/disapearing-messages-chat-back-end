import { UserModel } from ".prisma/client";
import { inject, injectable } from "inversify";
import { PrismaService } from "../database/prisma.service";
import { TYPES } from "../types";
import { User } from "./user.entity";
import { IUsersRepository } from "./users.repository.interface";

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @inject(TYPES.PrismaService) private prismaService: PrismaService
  ) {}

  async create({ publicKey, alias, name }: User): Promise<UserModel> {
    return this.prismaService.client.userModel.create({
      data: {
        publicKey,
        alias,
        name,
      },
    });
  }

  async find(publicKey: string): Promise<UserModel | null> {
    return this.prismaService.client.userModel.findFirst({
      where: {
        publicKey,
      },
    });
  }

  async update(user: User): Promise<UserModel> {
    return this.prismaService.client.userModel.update({
      where: {
        publicKey: user.publicKey,
      },
      data: {
        name: user.name,
        alias: user.alias,
      },
    });
  }
}
