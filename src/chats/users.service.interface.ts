import { UserModel } from "@prisma/client";
import { UserCreateDto } from "./dto/user-create.dto";

export interface IUserService {
  createUser: (dto: UserCreateDto) => Promise<UserModel | null>;
  validateUser: () => Promise<boolean>;
  getUserInfo: (email: string) => Promise<UserModel | null>;
}
