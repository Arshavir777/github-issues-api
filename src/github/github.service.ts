import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {

    private readonly githubApiUrl: string;

    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
    ) {
        this.githubApiUrl = this.configService.get<string>('GITHUB_API_URL');
    }

    async getIssuesByRepo(username: string, repository: string, page = 1, per_page = 10) {
        const url = `${this.githubApiUrl}/repos/${username}/${repository}/issues`;
        const params = { page, per_page };

        try {
            const response: AxiosResponse = await this.httpService.get(url, { params }).toPromise();
            const issues = response.data;
            const pagination = this.calculatePagination(response.headers.link, page, per_page);
            return { issues, pagination };
        } catch (error) {
            if (error?.response?.status === HttpStatusCode.NotFound) {
                throw new HttpException('Not found', HttpStatusCode.NotFound)
            }

            throw new HttpException(
                `Failed to fetch issues from ${username}/${repository}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    async getIssueByRepo(username: string, repository: string, issueNumber: number) {
        const url = `${this.githubApiUrl}/repos/${username}/${repository}/issues/${issueNumber}`;

        try {
            const response: AxiosResponse = await this.httpService.get(url).toPromise();
            return response.data;
        } catch (error) {

            if (error?.response?.status === HttpStatusCode.NotFound) {
                throw new HttpException('Issue not found', HttpStatusCode.NotFound)
            }

            throw new HttpException(
                `Failed to fetch issue #${issueNumber} from ${username}/${repository}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private calculatePagination(linkHeader: string, currentPage: number, pageSize: number) {
        if (!linkHeader) {
            return {
                totalItems: 0,
                currentPage,
                pageSize,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
            };
        }

        const totalItems = this.extractTotalItemsFromLink(linkHeader, pageSize);

        const totalPages = Math.ceil(totalItems / pageSize);
        return {
            totalItems,
            currentPage,
            pageSize,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
        };
    }

    private extractTotalItemsFromLink(linkHeader: string, pageSize: number): number {
        const lastPageLink = linkHeader.split(',').find((s) => s.includes('rel="last"'));
        if (!lastPageLink) {
            return 0;
        }

        const match = lastPageLink.match(/page=(\d+)>/);
        const lastPage = match ? parseInt(match[1], 10) : 1;
        return lastPage * pageSize;
    }
}
