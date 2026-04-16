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

  @Get('/clients/:id')
  async getClients(@Param('id') idEntrenador: string) {
    return this.appService.handleGetClients(idEntrenador);
  }

  @Get('/report-clients/:id')
  async trainerReport(@Param('id') idEntrenador: string) {
    return this.appService.handleGetTrainerReport(idEntrenador)
  }

  @Get('/report-client-plan/:id')
  async clientPlanReport(@Param('id') idCliente: string) {
    return this.appService.handleGetClientPlanReport(idCliente)
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
