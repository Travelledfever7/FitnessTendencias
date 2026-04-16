import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.MS_HOST ?? 'localhost',
        port: Number(process.env.MS_PORT ?? 4001),
      },
    },
  );

  await app.listen();
  console.log(`Running on port ${process.env.MS_PORT}`)
}

void bootstrap();
