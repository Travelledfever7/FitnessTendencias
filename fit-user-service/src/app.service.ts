import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AppRepository } from './app.repository';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly appRepo: AppRepository, @Inject('WORKSPACE_SERVICE') private workspaceClient: ClientProxy,
  ) { }

  async login(usuario: string, password: string) {
    const isValid = await this.appRepo.login(usuario, password);
    if (!isValid) {
      throw new RpcException(new UnauthorizedException('Credenciales invalidas'));
    }

    return 'Login Exitoso'
  }

  async register(nombre: string, usuario: string, password: string) {
    const registeredUser = await this.appRepo.register(nombre, usuario, password);
    const registeredUserPayloadId = { idEntrenador: registeredUser.id }

    const confirmationId = await firstValueFrom(
      this.workspaceClient.send<{ id: string }>(
        { cmd: 'createWorkspace' },
        registeredUserPayloadId,
      ),
    );
    console.log("ID de confirmacion de parte del WORKSPACE_SERVICE: ", confirmationId)
    return registeredUser
  }

  async getById(id: string) {
    return this.appRepo.getById(id)
  }
}
