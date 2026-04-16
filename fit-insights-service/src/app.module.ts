import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WORKSPACE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.WORKSPACE_MS_HOST ?? 'localhost',
          port: Number(process.env.WORKSPACE_MS_PORT ?? 3002),
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_MS_HOST ?? 'localhost',
          port: Number(process.env.USER_MS_PORT ?? 3001),
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
