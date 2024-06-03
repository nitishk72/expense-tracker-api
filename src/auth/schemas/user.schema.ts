import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

@Schema({
    timestamps: true
})

export class User {
    @ApiProperty({
        description: "Unique ID for this data",
        required: false,
        readOnly: true,
        type: String,
    })
    @Prop({})
    _id: Types.ObjectId;

    @Prop()
    name: string;

    @Prop({ unique: [true, 'This is Duplicate Email'] })
    email: string;


    @Prop({})
    password: string;

    @Prop({
        default: false,
        select: false,
    })
    is_deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);