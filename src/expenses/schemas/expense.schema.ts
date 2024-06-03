import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MinLength } from "class-validator";
import { SchemaTypes, Types } from "mongoose";
import { Category } from "src/category/schemas/category.schema";

@Schema({
    versionKey: false,
    timestamps: true
})
export class Expense {
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

    @Prop({
        required: true,
    })
    amount: number;

    @Prop()
    imageUrl?: string;


    @Prop({
        required: true,
    })
    userId?: string;

    @Prop({
        required: true,
        type: SchemaTypes.ObjectId,
        ref: Category.name,

    })
    categoryId: Types.ObjectId;

    @Prop({
        default: false,
    })
    is_deleted: boolean;


}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);