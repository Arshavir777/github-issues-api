import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './log.schema';
import { PaginationService } from '../common/pagination.service';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name) private logModel: Model<Log>,
    private readonly paginationService: PaginationService,
  ) {}

  async createLog(ip: string, action: string) {
    const log = new this.logModel({
      ip,
      action,
      dateTime: new Date(),
    });
    return log.save();
  }

  async getPaginatedLogs(page: number, perPage: number) {
    const totalItems = await this.logModel.countDocuments();
    const pagination = this.paginationService.calculatePagination(
      totalItems,
      page,
      perPage,
    );

    const logs = await this.logModel
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ dateTime: -1 });

    return {
      statistics: logs,
      pagination,
    };
  }
}
