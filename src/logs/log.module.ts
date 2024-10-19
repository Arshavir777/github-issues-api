import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './log.schema';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    ],
    providers: [LogsService],
    controllers: [LogsController],
    exports: [LogsService],
})
export class LogModule { }
