import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { clients } from '../data/clients.json'


@Injectable()
export class WorkspacesService {

  constructor(private readonly prismaService: PrismaService) { }


  async create(idEntrenador: string) {
    try {
      const createdWorkspace = await this.prismaService.workspaces.create({
        data: {
          idEntrenador,
          clients: clients,
        }
      })
      return idEntrenador
    } catch (error) {
      throw error
    }
  }

  async getClientNames(idEntrenador: string) {
    const workspace = await this.prismaService.workspaces.findUnique({
      where: {
        idEntrenador,
      },
      select: {
        clients: true,
      },
    });

    if (!workspace) {
      throw new Error('Workspace no encontrado');
    }

    const clients = (workspace.clients as any).clients;

    return clients.map((client: any) => client.name);
  }

  getCliente(idCliente: string) {
    return clients.find(client => client.id === idCliente);
  }


  async findWorkspace(idEntrenador: string) {
    try {
      const workspace = await this.prismaService.workspaces.findUnique({
        where: {
          idEntrenador,
        }
      })
      // Camila recibe el id del entrenador y el workspace completo con los clientes y sus datos
      return workspace
    } catch (error) {
      throw error
    }
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
