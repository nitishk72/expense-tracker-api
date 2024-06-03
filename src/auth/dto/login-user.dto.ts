import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginUserDto {

  @ApiProperty({
    description: "The user\'s email",
    required: false,
  })
  @IsEmail()
  email: string;


  @ApiProperty({
    description: "The user\'s password",
    required: false,
  })
  @MinLength(6)
  password: string;

}
