import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { Log, LogAction, LogSchema } from './log.schema';
import { PaginationService } from '../common/pagination.service';

describe('LogsService with in-memory MongoDB', () => {
  let logsService: LogsService;
  let mongod: MongoMemoryServer;
  let connection: Connection;
  let logModel: Model<Log>;

  const mockPaginationService = {
    calculatePagination: jest.fn(),
  };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: mongod.getUri(),
          }),
        }),
        MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
      ],
      providers: [
        LogsService,
        {
          provide: PaginationService,
          useValue: mockPaginationService, // Mock PaginationService
        },
      ],
    }).compile();

    logsService = module.get<LogsService>(LogsService);
    connection = module.get<Connection>(getConnectionToken());
    logModel = module.get<Model<Log>>(getModelToken(Log.name));
  });

  afterAll(async () => {
    await connection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    await logModel.deleteMany({});
    jest.clearAllMocks();
  });

  describe('createLog', () => {
    it('should create and save a new log in the database', async () => {
      const logData = { ip: '127.0.0.1', action: LogAction.GET_ISSUES };
      const result = await logsService.createLog(logData.ip, logData.action);

      expect(result).toHaveProperty('ip', logData.ip);
      expect(result).toHaveProperty('action', logData.action);
      expect(result).toHaveProperty('dateTime');
    });
  });

  describe('getPaginatedLogs', () => {
    it('should return paginated logs from the database', async () => {
      const logData = [
        { ip: '127.0.0.1', action: LogAction.GET_ISSUES, dateTime: new Date() },
        {
          ip: '192.168.1.1',
          action: LogAction.GET_SINGLE_ISSUE,
          dateTime: new Date(),
        },
      ];

      await logModel.insertMany(logData); // Insert sample logs

      const page = 1;
      const perPage = 10;
      const totalItems = logData.length;
      const mockPagination = { page, perPage, totalItems };

      mockPaginationService.calculatePagination.mockReturnValue(mockPagination);

      const result = await logsService.getPaginatedLogs(page, perPage);

      expect(result.statistics).toHaveLength(logData.length);
      expect(result.pagination).toEqual(mockPagination);
      expect(mockPaginationService.calculatePagination).toHaveBeenCalledWith(
        totalItems,
        page,
        perPage,
      );
    });
  });
});
