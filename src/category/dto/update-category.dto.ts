import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateCategoryDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "The Category\'s title",
    required: true,
  })
  title: string;


  @ApiProperty({
    description: "The Category\'s description",
    required: false,
  })
  description: string;



  @ApiProperty({
    description: "The Category\'s amount",
    required: false,
  })
  imageUrl?: string;
}
