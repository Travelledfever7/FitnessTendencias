import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  constructor(
    @Inject('WORKSPACE_SERVICE') private workspaceClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {}

  async generateTrainerReport(trainerId: string): Promise<{
    html: string;
    generatedAt: string;
    title: string;
    meta: { totalClients: number };
  }> {
    const trainerName = await firstValueFrom<string>(
      this.userClient.send<string>({ cmd: 'user_name_by_id' }, { trainerId }),
    );

    const workspaces = await firstValueFrom<WorkspaceResponse>(
      this.workspaceClient.send<WorkspaceResponse>(
        { cmd: 'findAllWorkspace' },
        { trainerId },
      ),
    );

    const { clients } = workspaces;

    const viewModel = {
      trainer_name: trainerName,
      generatedAt: new Date().toISOString(),
      clients: clients.map((c) => ({
        id: c.id,
        name: c.name,
        goal: c.goal,
      })),
      totalClients: clients.length,
    };

    const html = this.renderTemplate('trainer-report', viewModel);

    return {
      html,
      generatedAt: viewModel.generatedAt,
      title: 'Reporte de Clientes del Entrenador',
      meta: {
        totalClients: viewModel.totalClients,
      },
    };
  }

  async generateClientPlanReport(clientId: string): Promise<{
    html: string;
    generatedAt: string;
    title: string;
    meta: { totalTrainings: number; totalNutritionLogs: number };
  }> {
    const client = await firstValueFrom<Client>(
      this.workspaceClient.send<Client>({ cmd: 'findClient' }, { clientId }),
    );

    if (!client) {
      throw new Error(`Cliente con id ${clientId} no encontrado`);
    }

    const viewModel = {
      client_name: client.name,
      goal: client.goal,
      generatedAt: new Date().toISOString(),

      training: client.training.map((t) => ({
        date: t.date,
        completed: t.completed ? 'Sí' : 'No',
        exercises: t.exercises.map((e) => ({
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
        })),
      })),

      nutrition: client.nutrition.map((n) => ({
        date: n.date,
        calories: n.calories,
        waterMl: n.waterMl,
        supplements: n.supplements.length
          ? n.supplements.join(', ')
          : 'Ninguno',
      })),
    };

    const html = this.renderTemplate('client-plan-report', viewModel);

    return {
      html,
      generatedAt: viewModel.generatedAt,
      title: `Reporte de ${client.name}`,
      meta: {
        totalTrainings: client.training.length,
        totalNutritionLogs: client.nutrition.length,
      },
    };
  }

  private renderTemplate(templateName: string, data: object): string {
    const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);

    const source = fs.readFileSync(filePath, 'utf-8');
    const template = Handlebars.compile(source);

    return template(data);
  }
}

interface Client {
  id: string;
  name: string;
  goal: string;
  training: TrainingSession[];
  nutrition: NutritionLog[];
}

interface WorkspaceResponse {
  clients: Client[];
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface TrainingSession {
  date: string;
  completed: boolean;
  exercises: Exercise[];
}

interface NutritionLog {
  date: string;
  calories: number;
  waterMl: number;
  supplements: string[];
}
