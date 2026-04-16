import { Module } from '@nestjs/common';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [PrismaModule, WorkspacesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
