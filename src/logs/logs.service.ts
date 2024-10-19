import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './log.schema';

@Injectable()
export class LogsService {
    constructor(@InjectModel(Log.name) private logModel: Model<Log>) { }

    async createLog(ip: string, action: string): Promise<Log> {
        const log = new this.logModel({
            ip,
            action,
            dateTime: new Date(),
        });
        return log.save();
    }

    async getPaginatedLogs(page: number, per_page: number) {
        const totalItems = await this.logModel.countDocuments();
        const totalPages = Math.ceil(totalItems / per_page);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const logs = await this.logModel
            .find()
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({ dateTime: -1 }); // Sort by date-time, descending

        return {
            logs,
            pagination: {
                totalItems,
                currentPage: page,
                pageSize: per_page,
                totalPages,
                hasNextPage,
                hasPrevPage,
            },
        };
    }
}
