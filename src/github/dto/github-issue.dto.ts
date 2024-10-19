import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  avatar_url: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  html_url: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  site_admin: boolean;
}

class LabelDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  color: string;
}

class ReactionsDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  total_count: number;

  @ApiProperty({ name: '+1' })
  '+1': number;

  @ApiProperty({ name: '-1' })
  '-1': number;

  @ApiProperty()
  laugh: number;

  @ApiProperty()
  hooray: number;

  @ApiProperty()
  confused: number;

  @ApiProperty()
  heart: number;

  @ApiProperty()
  rocket: number;

  @ApiProperty()
  eyes: number;
}

export class GithubIssueDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  repository_url: string;

  @ApiProperty()
  labels_url: string;

  @ApiProperty()
  comments_url: string;

  @ApiProperty()
  events_url: string;

  @ApiProperty()
  html_url: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  node_id: string;

  @ApiProperty()
  number: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: [LabelDto], required: false })
  labels: LabelDto[];

  @ApiProperty()
  state: string;

  @ApiProperty()
  locked: boolean;

  @ApiProperty({ type: 'string', nullable: true })
  assignee: string | null;

  @ApiProperty({ type: [String], required: false })
  assignees: string[];

  @ApiProperty({ type: 'string', nullable: true })
  milestone: string | null;

  @ApiProperty()
  comments: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty({ type: 'string', nullable: true })
  closed_at: string | null;

  @ApiProperty()
  author_association: string;

  @ApiProperty({ type: ReactionsDto })
  reactions: ReactionsDto;

  @ApiProperty()
  timeline_url: string;

  @ApiProperty({ type: 'string', nullable: true })
  state_reason: string | null;
}
