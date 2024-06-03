import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Date, Types } from "mongoose";

@Schema({
  timestamps: true
})
export class UserToken {
  @ApiProperty({
    description: "Unique ID for this data",
    required: false,
    readOnly: true,
    type: String,
  })
  @Prop({})
  _id: Types.ObjectId;

  @Prop()
  userId: string;

  @Prop({})
  userAgent: string;

  @Prop()
  refreshToken: string;

  @Prop({
    type: Date,
  })
  usedAt: Date;

  @Prop({
    default: false,
    select: false,
  })
  is_deleted: boolean;
}


export const UserTokenSchema = SchemaFactory.createForClass(UserToken);