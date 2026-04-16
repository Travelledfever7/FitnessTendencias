import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WorkspacesService } from './workspaces.service';

@Controller()
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @MessagePattern({ cmd : 'createWorkspace'})
  create(data: { idEntrenador: number }) {
    return this.workspacesService.create(data.idEntrenador);
  }
  

  @MessagePattern({ cmd : 'findAllWorkspace' })
  findWorkspace(idEntrenador: number) {
    return this.workspacesService.findWorkspace(idEntrenador);
  }

  @MessagePattern({ cmd : 'findClients' })
  findClients(idEntrenador: number) {
    return this.workspacesService.getClientNames(idEntrenador);
  }

  @MessagePattern('removeWorkspace')
  remove(@Payload() id: number) {
    return this.workspacesService.remove(id);
  }
}
