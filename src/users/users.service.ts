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

  async createUser(userToCreate: UserCreateDto): Promise<UserModel | null> {
    const userAlreadyExist = this.usersRepository.findByAlias(userToCreate.alias)
    if(userAlreadyExist) return null
    return this.usersRepository.create(userToCreate);
  }

  async updateUserInfo(
    { name, alias }: UserCreateDto,
    userPublicKey: string
  ): Promise<User | null> {
    const newUser = new User(userPublicKey, name, alias);
    await this.usersRepository.update(newUser);
    return newUser;
  }

  // async validateUser(userPublicKey: string, nonce: string): Promise<boolean> {
  //   const existedUser = await this.usersRepository.find(email);
  //   if (!existedUser) {
  //     return false;
  //   }
  //   const newUser = new User(
  //     existedUser.email,
  //     existedUser.name,
  //     existedUser.password
  //   );
  //   return newUser.comparePassword(password);
  // }

  async getUserInfo(publicKey: string): Promise<UserModel | null> {
    return this.usersRepository.find(publicKey);
  }
}
