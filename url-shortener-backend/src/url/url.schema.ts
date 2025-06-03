import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })

export class Url extends Document {
    @Prop({required:true})
    originalUrl: string;

    @Prop({ required: true, unique: true})
    shortCode: string;

    @Prop({ required: true})
    userId: string;

    @Prop()
    createdAt: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url)