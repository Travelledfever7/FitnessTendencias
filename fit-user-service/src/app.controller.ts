import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Post('/login')
  // async loginHttp(@Body() body: UserCredentials) {
  //   return this.appService.login(body.usuario, body.password);
  // }

  @MessagePattern({ cmd: 'user_login' })
  async login(@Payload() payload: UserCredentials) {
    return this.appService.login(payload.usuario, payload.password);
  }

  // @Post('/register')
  // async registerHttp(@Body() body: RegisterPayload) {
  //   return this.appService.register(body.nombre, body.usuario, body.password);
  // }

  @MessagePattern({ cmd: 'user_register' })
  async register(@Payload() payload: RegisterPayload) {
    return this.appService.register(payload.nombre, payload.usuario, payload.password);
  }

  @MessagePattern({ cmd: 'user_name_by_id' })
  async getById(@Payload() payload: UserId) {
    return this.appService.getById(payload.id);
  }
}


type UserCredentials = {
  usuario: string;
  password: string;
};

type UserId = {
  id: string
}

type RegisterPayload = {
  nombre: string;
  usuario: string;
  password: string;
};
