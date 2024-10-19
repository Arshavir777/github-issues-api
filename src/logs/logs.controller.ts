import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LogsResponseDto } from './dto/logs-response.dto';
import { LogsService } from './logs.service';

@ApiTags('Logs')
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @ApiOperation({ summary: 'Get paginated logs' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
    description: 'Number of logs per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'List of logs',
    type: LogsResponseDto,
  })
  @Get('')
  async getLogs(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('per_page', new ParseIntPipe({ optional: true })) perPage?: number,
  ): Promise<LogsResponseDto> {
    return this.logsService.getPaginatedLogs(page ?? 1, perPage ?? 10);
  }
}
