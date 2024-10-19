import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GithubService } from './github.service';
import { IssuesResponseDto } from './dto/issues-response.dto';
import { GithubIssueDto } from './dto/github-issue.dto';
import { Request } from 'express';
import { LogAction } from 'src/logs/log.schema';
import { LogsService } from 'src/logs/logs.service';

@ApiTags('GitHub')
@Controller('github')
export class GithubController {
    constructor(
        private readonly githubService: GithubService,
        private readonly logsService: LogsService,
    ) { }

    @ApiOperation({ summary: 'Get paginated GitHub issues with total count for a repository' })
    @ApiParam({ name: 'username', type: String, description: 'GitHub username', example: 'facebook' })
    @ApiParam({ name: 'repository', type: String, description: 'GitHub repository name', example: 'react' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination', example: 1 })
    @ApiQuery({ name: 'per_page', required: false, type: Number, description: 'Number of issues per page', example: 10 })
    @ApiResponse({ status: 200, description: 'List of GitHub issues and pagination info', type: IssuesResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Get('issues/:username/:repository')
    async getIssues(
        @Param('username') username: string,
        @Param('repository') repository: string,
        @Query('page') page = 1,
        @Query('per_page') per_page = 10,
        @Req() req: Request
    ): Promise<IssuesResponseDto> {
        const result = await this.githubService.getIssuesByRepo(username, repository, Number(page), Number(per_page));
        await this.logsService.createLog(req.ip, LogAction.GET_ISSUES);
        return result;
    }

    @ApiOperation({ summary: 'Get a single GitHub issue by its number' })
    @ApiParam({ name: 'username', type: String, description: 'GitHub username', example: 'facebook' })
    @ApiParam({ name: 'repository', type: String, description: 'GitHub repository name', example: 'react' })
    @ApiParam({ name: 'issueNumber', type: Number, description: 'Issue number', example: 31290 })
    @ApiResponse({ status: 200, description: 'The GitHub issue details', type: GithubIssueDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 404, description: 'Not Found' })
    @Get('issues/:username/:repository/:issueNumber')
    async getSingleIssue(
        @Param('username') username: string,
        @Param('repository') repository: string,
        @Param('issueNumber') issueNumber: number,
        @Req() req: Request
    ): Promise<GithubIssueDto> {
        const result = await this.githubService.getIssueByRepo(username, repository, issueNumber);
        await this.logsService.createLog(req.ip, LogAction.GET_SINGLE_ISSUE);
        return result;
    }
}
