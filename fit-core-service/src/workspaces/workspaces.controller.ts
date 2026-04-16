import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WorkspacesService } from './workspaces.service';

@Controller()
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @MessagePattern({ cmd : 'createWorkspace'})
  create(@Payload() data: { idEntrenador: number }) {
    return this.workspacesService.create(data.idEntrenador);
  }
  
  @MessagePattern({ cmd : 'findAllWorkspace' })
  findWorkspace(@Payload() data: { idEntrenador: number }) {
    return this.workspacesService.findWorkspace(data.idEntrenador);
  }

  @MessagePattern({ cmd : 'findClients' })
  findClients(@Payload() data: { idEntrenador: number }) {
    return this.workspacesService.getClientNames(data.idEntrenador);
  }
}
