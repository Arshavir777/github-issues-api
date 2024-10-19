import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LogsResponseDto } from './dto/logs-response.dto';
import { LogsService } from './logs.service';

@ApiTags('Logs')
@Controller('logs')
export class LogsController {
    constructor(private readonly logsService: LogsService) { }

    @ApiOperation({ summary: 'Get paginated logs' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
    @ApiQuery({ name: 'per_page', required: false, description: 'Number of logs per page', example: 10 })
    @ApiResponse({ status: 200, description: 'List of logs', type: LogsResponseDto })
    @Get('')
    async getLogs(
        @Query('page') page = 1,
        @Query('per_page') per_page = 10,
    ): Promise<LogsResponseDto> {
        return this.logsService.getPaginatedLogs(Number(page), Number(per_page));
    }
}
