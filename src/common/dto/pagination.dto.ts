import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
    @ApiProperty()
    totalItems: number;

    @ApiProperty()
    currentPage: number;

    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    hasNextPage: boolean;

    @ApiProperty()
    hasPrevPage: boolean;
}