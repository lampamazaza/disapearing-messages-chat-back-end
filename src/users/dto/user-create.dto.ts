import { IsBase64, IsString } from "class-validator";

export class UserCreateDto {
  @IsString({ message: "Non valid public key" })
  @IsBase64({ message: "PublicKey should be based64 format" })
  publicKey: string;

  @IsString({ message: "Non valid name" })
  name: string;

  @IsString({ message: "Non valid alias" })
  alias: string;
}
