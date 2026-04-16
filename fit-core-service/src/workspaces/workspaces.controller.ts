import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WorkspacesService } from './workspaces.service';

@Controller()
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) { }

  @MessagePattern({ cmd: 'createWorkspace' })
  create(@Payload() data: { idEntrenador: string }) {
    return this.workspacesService.create(data.idEntrenador);
  }

  @MessagePattern({ cmd: 'findAllWorkspace' })
  findWorkspace(@Payload() data: { trainerId: string }) {
    return this.workspacesService.findWorkspace(data.trainerId);
  }

  @MessagePattern({ cmd: 'findClients' })
  findClients(@Payload() data: { idEntrenador: string }) {
    return this.workspacesService.getClientNames(data.idEntrenador);
  }

  @MessagePattern({ cmd: 'findClient' })
  findClient(@Payload() data: { idCliente: string }) {
    return this.workspacesService.getCliente(data.idCliente);
  }
}
