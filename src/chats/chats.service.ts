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

  async getUserChats(publicKey: string): Promise<ChatModel[] | null> {
    return this.chatsRepository.find(publicKey);
  }
}
