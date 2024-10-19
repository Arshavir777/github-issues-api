import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  public calculatePagination(
    totalItems: number,
    currentPage: number,
    pageSize: number,
  ) {
    if (!totalItems) {
      return {
        totalItems: 0,
        currentPage,
        pageSize,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

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

  public extractTotalItemsFromLink(linkHeader: string, pageSize: number) {
    const lastPageLink = linkHeader
      .split(',')
      .find((s) => s.includes('rel="last"'));
    if (!lastPageLink) {
      return 0;
    }

    const match = lastPageLink.match(/page=(\d+)>/);
    const lastPage = match ? parseInt(match[1], 10) : 1;
    return lastPage * pageSize;
  }
}
