
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>; // representa el documento completo de Mongoose (incluye `_id` y metodos internos)

@Schema()
export class User {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  usuario: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User); // transforma la clase TypeScript en un schema real de Mongoose
