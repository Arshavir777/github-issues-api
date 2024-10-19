import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { GithubClientProvider } from './github-client.provider';
import { PaginationService } from 'src/common/pagination.service';

@Injectable()
export class GithubService {
  constructor(
    private githubClientProvider: GithubClientProvider,
    private paginationService: PaginationService,
  ) {}

  async getIssuesByRepo(
    username: string,
    repository: string,
    page: number,
    perPage: number,
  ) {
    const params = { page, per_page: perPage };
    try {
      const { issues, link } = await this.githubClientProvider.getIssues(
        username,
        repository,
        params,
      );

      const totalItems = this.paginationService.extractTotalItemsFromLink(
        link,
        perPage,
      );
      const pagination = this.paginationService.calculatePagination(
        totalItems,
        page,
        perPage,
      );

      return { issues, pagination };
    } catch (error) {
      if (error?.response?.status === HttpStatusCode.NotFound) {
        throw new NotFoundException();
      }

      throw new HttpException(
        `Failed to fetch issues from ${username}/${repository}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getIssueByRepo(
    username: string,
    repository: string,
    issueNumber: number,
  ) {
    try {
      const issue = await this.githubClientProvider.getIssue(
        username,
        repository,
        issueNumber,
      );
      return issue;
    } catch (error) {
      if (error?.response?.status === HttpStatusCode.NotFound) {
        throw new NotFoundException('Issue not found');
      }

      throw new HttpException(
        `Failed to fetch issue #${issueNumber} from ${username}/${repository}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
