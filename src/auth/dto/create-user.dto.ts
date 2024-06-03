import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength, minLength } from "class-validator";
import { Types } from "mongoose";

export class CreateUserDto {
  @ApiProperty({
    description: "The user\'s id",
    required: true,
    readOnly: true,
  })
  _id: Types.ObjectId;

  @IsNotEmpty()
  @ApiProperty({
    description: "The user\'s name",
    required: true,
  })
  @MinLength(3)
  name: string;


  @ApiProperty({
    description: "The user\'s email",
    required: false,
  })
  @IsEmail()
  email: string;



  @ApiProperty({
    description: "The user\'s password",
    required: false,
    minimum: 6,
  })
  @MinLength(6)
  password: string;

}
