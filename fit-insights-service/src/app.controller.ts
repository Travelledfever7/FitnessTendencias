import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'generate_trainer_report' })
  async generateTrainerReport(@Payload() payload: { trainerId: string }) {
    return this.appService.generateTrainerReport(payload.trainerId);
  }

  @MessagePattern({ cmd: 'generate_client_plan_report' })
  async generateClientPlanReport(@Payload() payload: { clientId: string }) {
    return this.appService.generateClientPlanReport(payload.clientId);
  }
}
