import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AppRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async login(usuario: string, password: string): Promise<boolean> {
    const user = await this.userModel.findOne({ usuario, password }).lean(); //lean -> devolver un objeto JS plano, no un documento Mongoose (con sus metodos)
    return Boolean(user);
  }

  async register(nombre: string, usuario: string, password: string): Promise<{ id: string; nombre: string; usuario: string }> {
    const createdUser = await this.userModel.create({ nombre, usuario, password });

    return {
      id: createdUser._id.toString(),
      nombre: createdUser.nombre,
      usuario: createdUser.usuario,
    };
  }

  async getById(id: string): Promise<string> {
    const user = await this.userModel.findById(id).lean()
    return user?.nombre ?? 'Usuario no encontrado'
  }
}
