import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    /*
      Se inicalizan los microservicios con sus puertos y host.
      Cada uno con su name para poder inyectarlos en el app.service
    */
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_MS_HOST ?? 'localhost',
          port: Number(process.env.USERS_MS_PORT ?? 4001)
        }
      },
      {
        name: "WORKSPACE_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.WORKSPACE_MS_HOST ?? 'localhost',
          port: Number(process.env.WORKSPACE_MS_PORT) ?? 4002
        }
      },
      {
        name: "INSIGHTS_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.INSIGHTS_MS_HOST ?? 'localhost',
          port: Number(process.env.INSIGHTS_MS_PORT) ?? 4003
        }
      },
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
