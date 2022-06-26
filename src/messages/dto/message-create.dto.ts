import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class MessageCreateDto {
  @IsString({ message: "Non valid public key" })
  toPublicKey: string;

  // @
  // @IsNumber({}, { message: "Non valid chat id" })
  chatId: number;

  @IsString({ message: "Message should be a string" })
  @IsNotEmpty({ message: "Message should not be empty" })
  @MaxLength(500, {
    message: "Message should not be longer than 500 characters",
  })
  message: string;
}
