import { UserModel } from ".prisma/client";
import { inject, injectable } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
// import { UserLoginDto } from "./dto/user-login.dto";
import { UserCreateDto } from "./dto/user-create.dto";
import { User } from "./user.entity";
import { IUsersRepository } from "./users.repository.interface";
import { IUserService } from "./users.service.interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository
  ) {}

  async createUser({
    publicKey,
    name,
    alias,
  }: UserCreateDto): Promise<UserModel | null> {
    const newUser = new User(publicKey, name, alias);
    const existedUser = await this.usersRepository.find(publicKey);
    if (existedUser) {
      return null;
    }
    return this.usersRepository.create(newUser);
  }

  async validateUser(): Promise<boolean> {
    // const existedUser = await this.usersRepository.find(email);
    // if (!existedUser) {
    //   return false;
    // }
    // const newUser = new User(
    //   existedUser.email,
    //   existedUser.name,
    //   existedUser.password
    // );
    // return newUser.comparePassword(password);
    return true;
  }

  async getUserInfo(publicKey: string): Promise<UserModel | null> {
    return this.usersRepository.find(publicKey);
  }
}
