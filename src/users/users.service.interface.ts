import { UserModel } from "@prisma/client";
import { UserCreateDto } from "./dto/user-create.dto";
import { User } from "./user.entity";

export interface IUserService {
  createUser: (dto: UserCreateDto) => Promise<UserModel | null>;
  updateUserInfo: (
    dto: UserCreateDto,
    userPublicKey: string
  ) => Promise<User | null>;
  validateUser: () => Promise<boolean>;
  getUserInfo: (publicKey: string) => Promise<UserModel | null>;
}
