import { ApiProperty } from "@nestjs/swagger";
import { MinLength } from "class-validator";

export class UpdateUserPasswordDto {

  @ApiProperty({
    description: "The user\'s new password",
    required: false,
    minLength: 6,
  })
  @MinLength(6)
  password: string;

}
