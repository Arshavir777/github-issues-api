import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { LogModule } from 'src/logs/log.module';

@Module({
  imports: [HttpModule, LogModule],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
