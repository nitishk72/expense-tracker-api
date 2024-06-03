import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MinLength } from "class-validator";
import { SchemaTypes, Types } from "mongoose";

@Schema({
    versionKey: false,
    timestamps: true
})
export class Category {
    @Prop({
        required: true,
        type: SchemaTypes.ObjectId,
    })
    _id: Types.ObjectId;

    @Prop({
        required: true,
    })
    @MinLength(3)
    title: string;

    @Prop()
    description?: string;

    @Prop()
    imageUrl?: string;


    @Prop({
        required: true,
    })
    userId?: string;


    @Prop({
        default: false,
    })
    is_deleted: boolean;


}

export const CategorySchema = SchemaFactory.createForClass(Category);