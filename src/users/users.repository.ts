import { UserModel } from "../database/models";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { User } from "./user.entity";
import { IUsersRepository } from "./users.repository.interface";
import { SqliteService } from "../database/sqlite.service";

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @inject(TYPES.SqliteService) private sqliteService: SqliteService
  ) {}
  async create({ publicKey, alias, name }: User): Promise<UserModel> {
    return this.sqliteService.client.get(
      `INSERT INTO users
  (publicKey, name, alias)
  VALUES (?, ?, ?)  RETURNING id, publicKey, name, alias`,
      [publicKey, name, alias]
    );
  }

  async find(publicKey: string): Promise<UserModel | null> {
    return this.sqliteService.client.get(
      "SELECT * FROM users WHERE publicKey = ?",
      publicKey
    );
  }
  async findByAlias(alias: string): Promise<UserModel | null> {
    return this.sqliteService.client.get(
      "SELECT * FROM users WHERE alias = ?",
      alias
    );
  }

  async update(user: User): Promise<UserModel> {
    return this.sqliteService.client.get(
      "UPDATE users SET name = ? WHERE publicKey = ? RETURNING id, publicKey, name, alias",
      [user.name, user.publicKey]
    );
  }
}
