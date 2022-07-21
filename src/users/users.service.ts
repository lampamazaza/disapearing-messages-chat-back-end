import { UserModel } from ".prisma/client";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { UserCreateDto } from "./dto/user-create.dto";
import { User } from "./user.entity";
import { IUsersRepository } from "./users.repository.interface";
import { IUserService } from "./users.service.interface";
import { IAuthenticationService } from "services/authenticationService/authentication.interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
    @inject(TYPES.AuthenticationService)
    private authenticationService: IAuthenticationService
  ) { }

  async createUser(userToCreate: UserCreateDto): Promise<UserModel | null> {
    const userAlreadyExist = await this.usersRepository.findByAlias(
      userToCreate.alias
    );
    if (userAlreadyExist) return null;
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

  async authenticate(decryptedMsg: number[], publicKey: string) {
    const user = await this.usersRepository.find(publicKey)
    if (user === null) {
      throw new Error("This user doesn't exist")
    }
    const isSuccessfullyAuthenticated =
      this.authenticationService.checkAuthenticationResult(
        decryptedMsg,
        publicKey
      );

    return {
      isSuccessfullyAuthenticated,
      user: isSuccessfullyAuthenticated
        ? user
        : null,
    };
  }

  async getAuthenticationData(userPublicKey: string): Promise<any> {
    const user = await this.usersRepository.find(userPublicKey)
    if (user === null) {
      throw new Error("This user doesn't exist")
    }
    return this.authenticationService.generateAuthenticationData(userPublicKey);
  }

  async getUserInfo(alias: string): Promise<UserModel | null> {
    return this.usersRepository.findByAlias(alias);
  }

  async getUserInfoByPublicKey(publicKey: string): Promise<UserModel | null> {
    return this.usersRepository.find(publicKey);
  }

  async login(publicKey: string): Promise<UserModel | null> {
    return this.usersRepository.find(publicKey);
  }
}
