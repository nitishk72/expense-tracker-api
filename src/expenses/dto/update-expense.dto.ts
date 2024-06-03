import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class UpdateExpenseDto {

  @IsNotEmpty()
  @ApiProperty({
    description: "The Expense\'s title",
    required: true,
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
    type: 'MongoDB_ID',
    description: "The Expense\'s category ID",
    required: true,
  })
  @IsMongoId({ message: 'CategoryId must be a valid MongoDB ObjectId' })
  categoryId: Types.ObjectId;

}
