import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AppRepository } from './app.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/fit-user-service',
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // TODO: toca cambiar los puertos a los otros MS
    ClientsModule.register([
      {
        name: 'WORKSPACE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.WORKSPACE_MS_HOST ?? 'localhost',
          port: Number(process.env.WORKSPACE_MS_PORT ?? 4001),
        },
      }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, AppRepository],
})
export class AppModule { }
