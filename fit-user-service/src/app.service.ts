import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AppRepository } from './app.repository';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

type MongoDuplicateKeyError = {
  code?: number;
  keyPattern?: Record<string, number>;
};

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
    const registeredUserPayloadId = { id: registeredUser.id }

    await firstValueFrom(
      // Esto no debe ser asi por que yo no se el nombre del entrnador, ni el usuario, 
      this.workspaceClient.send<{ id: string }>(
        { cmd: 'user_name_by_id' }, // TODO: toca cambiar el cmd al de WORKSPACE_SERVICE para registrar el usuario y vincularlo con los clientes
        registeredUserPayloadId,
      ),
    );

    return registeredUser
  }

  async getById(id: string) {
    return this.appRepo.getById(id)
  }
}
