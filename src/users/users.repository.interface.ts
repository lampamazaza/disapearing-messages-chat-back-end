import { UserModel } from "../database/models";
import { User } from "./user.entity";
export interface IUsersRepository {
  create: (user: User) => Promise<UserModel>;
  update: (user: User) => Promise<UserModel>;
  find: (publicKey: string) => Promise<UserModel | null>;
  findByAlias: (alias: string) => Promise<UserModel | null>;
}
