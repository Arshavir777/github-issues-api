import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { GithubIssueDto } from './dto/github-issue.dto';
import { AxiosError } from 'axios';

@Injectable()
export class GithubClientProvider {
  private readonly githubApiUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.githubApiUrl = this.configService.get<string>('GITHUB_API_URL');
  }

  async getIssues(
    username: string,
    repo: string,
    params: { page: number; per_page: number },
  ) {
    const url = `${this.githubApiUrl}/repos/${username}/${repo}/issues`;

    const { data: issues, headers } = await firstValueFrom(
      this.httpService.get<GithubIssueDto[]>(url, { params }).pipe(
        catchError((error: AxiosError) => {
          throw error;
        }),
      ),
    );

    return {
      issues,
      link: headers.link,
    };
  }

  async getIssue(username: string, repo: string, issueNumber: number) {
    const url = `${this.githubApiUrl}/repos/${username}/${repo}/issues/${issueNumber}`;
    const { data } = await firstValueFrom(
      this.httpService.get<GithubIssueDto>(url).pipe(
        catchError((error: AxiosError) => {
          throw error;
        }),
      ),
    );

    return data;
  }
}
