import { ApiProperty } from "@nestjs/swagger";

export class PaginatedMeta {
  @ApiProperty({
    description: 'If there is more page after this page'
  })

  has_more_page: boolean;

  @ApiProperty({
    description: 'Number of items in the current page'
  })

  page_size: number;

  @ApiProperty({
    description: 'Current Page Numer'
  })

  current_page: number;

  @ApiProperty({
    description: 'The maximum data one query can have'
  })
  per_page_item: number;

  @ApiProperty({
    description: 'Total possible page are there'
  })
  total_pages: number;

  @ApiProperty({
    description: 'Total available items in the database for this table/collection'
  })
  total_items: number;
}

export class PaginationResponseDto<T> {
  @ApiProperty()
  meta?: PaginatedMeta;

  @ApiProperty()
  items: T[];
}

