import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaTypes, Types } from 'mongoose';


export class AbstractDocument {
  @ApiProperty({
    description: "Unique ID for this data",
    required: false,
    readOnly: true,
    type: String,
  })
  @Prop({
    type: SchemaTypes.ObjectId,
  })
  _id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.Boolean,
    default: false,
    select: false,
  })
  is_deleted: boolean;

  @ApiProperty({
    description: "Created at time for this data",
    required: false,
    readOnly: true
  })
  @Prop({
    type: SchemaTypes.Date,
    select: true,
  })
  created_at?: Date;

  @ApiProperty({
    description: "Last updated at time of this data",
    required: false,
    readOnly: true,
  })
  @Prop({
    type: SchemaTypes.Date,
    select: true,
  })
  updated_at?: Date;
}