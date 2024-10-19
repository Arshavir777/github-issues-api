import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { LogModule } from 'src/logs/log.module';
import { GithubClientProvider } from './github-client.provider';
import { PaginationService } from '../common/pagination.service';

@Module({
  imports: [HttpModule, LogModule],
  controllers: [GithubController],
  providers: [GithubService, GithubClientProvider, PaginationService],
})
export class GithubModule {}
