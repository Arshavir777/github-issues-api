import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './log.schema';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { PaginationService } from 'src/common/pagination.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [LogsService, PaginationService],
  controllers: [LogsController],
  exports: [LogsService],
})
export class LogModule {}
