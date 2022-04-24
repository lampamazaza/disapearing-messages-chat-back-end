import { IsString } from "class-validator";

export class UserCreateDto {
  @IsString({ message: "Non valid public key" })
  publicKey: string;

  @IsString({ message: "Non valid name" })
  name: string;

  @IsString({ message: "Non valid alias" })
  alias: string;
}
