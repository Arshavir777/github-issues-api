import { ApiProperty } from '@nestjs/swagger';
import { GithubIssueDto } from './github-issue.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class IssuesResponseDto {
  @ApiProperty({ type: [GithubIssueDto] })
  issues: GithubIssueDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}
