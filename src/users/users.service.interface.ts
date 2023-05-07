import { UserModel } from "../database/models";
import { UserCreateDto } from "./dto/user-create.dto";
import { User } from "./user.entity";

export interface IUserService {
  createUser: (dto: UserCreateDto) => Promise<UserModel | null>;
  updateUserInfo: (
    dto: UserCreateDto,
    userPublicKey: string
  ) => Promise<User | null>;
  // validateUser: () => Promise<boolean>;
  getUserInfo: (alias: string) => Promise<UserModel | null>;
  getUserInfoByPublicKey: (publicKey: string) => Promise<UserModel | null>;
  getAuthenticationData: (publicKey: string) => Promise<any>;
  authenticate: (
    decryptedMsg: string,
    publicKey: string
  ) => Promise<{
    isSuccessfullyAuthenticated: boolean;
    user: UserModel | null;
  }>;
  login: (userPublicKey: string) => Promise<UserModel | null>;
}
