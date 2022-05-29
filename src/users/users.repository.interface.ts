import { UserModel } from "@prisma/client";
import { User } from "./user.entity";
export interface IUsersRepository {
  create: (user: User) => Promise<UserModel>;
  update: (user: User) => Promise<UserModel>;
  find: (publicKey: string) => Promise<UserModel | null>;
}
