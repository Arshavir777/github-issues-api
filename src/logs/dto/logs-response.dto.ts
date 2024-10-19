
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Log } from '../log.schema';

export class LogsResponseDto {
    @ApiProperty({ type: [Log] })
    logs: Log[];

    @ApiProperty({ type: PaginationDto })
    pagination: PaginationDto;
}
