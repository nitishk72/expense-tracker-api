import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";
import { IsMongoId } from "src/helper/is-mongo-id.decorator";
export class CreateExpenseDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  @ApiProperty({
    description: "The Expense\'s title",
    required: true,
    minimum: 3
  })
  title: string;


  @ApiProperty({
    description: "The Expense\'s description",
    required: false,
  })
  description: string;



  @ApiProperty({
    description: "The Expense\'s amount",
    required: false,
  })
  amount: number;


  @ApiProperty({
    type: Types.ObjectId,
    description: "The Expense\'s category ID",
    required: true,
  })
  @IsMongoId({ message: 'CategoryId must be a valid MongoDB ObjectId' })
  categoryId: Types.ObjectId;
}
