import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
/*
  Controlador que recibe las peticiones HTTP y redirecciona al servicio.
  Se podria realizar un servicio para cada redireccion.
*/
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/auth/login')
  async userLogin(@Body() body: UserCredentials) {
    return this.appService.handleUserLogin(body.usuario, body.password);
  }

  @Post('/auth/register')
  async userRegister(@Body() body: RegisterUser) {
    return this.appService.handleUserRegister(body.nombre, body.usuario, body.password);
  }

  @Get('/clients')
  async getClients(@Param('id') idEntrenador: number) {
    return this.appService.handleGetClients(idEntrenador);
  }
}

type UserCredentials = {
  usuario: string,
  password: string
}

type RegisterUser = {
  nombre: string;
  usuario: string;
  password: string;
};
