import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.MS_HOST ?? 'localhost',
        port: Number(process.env.MS_PORT ?? 3003),
      },
    },
  );
  await app.listen();
}
bootstrap();
