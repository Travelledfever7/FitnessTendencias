import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

/*
  El servicio es el encargado de inyectar los SERVICES y mandarlos con MessagePattern
  a su respectivo comando (cmd) y el payload con los datos que necesita el metodo de cada microservicio
*/
@Injectable()
export class AppService {

  constructor(@Inject("USER_SERVICE") private readonly userMService: ClientProxy) { }

  async handleUserLogin(usuario: string, password: string) {
    const pattern = { cmd: 'user_login' }
    const payload = { usuario, password }
    try {
      return await firstValueFrom(
        this.userMService.send<string>(pattern, payload),
      );
    } catch (err: any) {
      const statusCode = err?.response?.statusCode;
      const message = err?.response?.message ?? err?.message;
      if (statusCode === 401) {
        throw new UnauthorizedException(message ?? 'Unauthorized');
      }
      throw err;
    }
  }

  async handleUserRegister(nombre: string, usuario: string, password: string) {
    const pattern = { cmd: 'user_register' }
    const payload = { nombre, usuario, password }

    return this.userMService.send<string>(pattern, payload)
  }

  async handleGetClients(idEntrenador: number) {
    const pattern = { cmd: 'findClients' }
    const payload = idEntrenador
    return this.userMService.send<string>(pattern, payload)
  }
}
