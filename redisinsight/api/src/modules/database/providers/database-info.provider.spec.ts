import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import {
  mockFeatureService,
  mockIOClusterNode1,
  mockIOClusterNode2,
  mockIORedisClient,
  mockIORedisCluster,
  mockRedisClientList,
  mockRedisClientListResult,
  mockRedisClientsInfoResponse,
  mockRedisServerInfoResponse,
  mockStandaloneRedisInfoReply, MockType,
} from 'src/__mocks__';
import { REDIS_MODULES_COMMANDS, AdditionalRedisModuleName } from 'src/constants';
import { DatabaseInfoProvider } from 'src/modules/database/providers/database-info.provider';
import { RedisDatabaseInfoResponse } from 'src/modules/database/dto/redis-info.dto';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { FeatureService } from 'src/modules/feature/feature.service';

const mockRedisServerInfoDto = {
  redis_version: '6.0.5',
  redis_mode: 'standalone',
  os: 'Linux 4.15.0-1087-gcp x86_64',
  arch_bits: '64',
  tcp_port: '11113',
  uptime_in_seconds: '1000',
};

const mockRedisGeneralInfo: RedisDatabaseInfoResponse = {
  version: mockRedisServerInfoDto.redis_version,
  databases: 16,
  role: 'master',
  server: mockRedisServerInfoDto,
  usedMemory: 1000000,
  totalKeys: 1,
  connectedClients: 1,
  uptimeInSeconds: 1000,
  hitRatio: 1,
};

const mockRedisModuleList = [
  { name: 'ai', ver: 10000 },
  { name: 'graph', ver: 10000 },
  { name: 'rg', ver: 10000 },
  { name: 'bf', ver: 10000 },
  { name: 'ReJSON', ver: 10000 },
  { name: 'search', ver: 10000 },
  { name: 'timeseries', ver: 10000 },
  { name: 'customModule', ver: 10000 },
].map((item) => ([].concat(...Object.entries(item))));

const mockUnknownCommandModule = new Error("unknown command 'module'");

describe('DatabaseInfoProvider', () => {
  let service: DatabaseInfoProvider;
  let featureService: MockType<FeatureService>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseInfoProvider,
        {
          provide: FeatureService,
          useFactory: mockFeatureService,
        },
      ],
    }).compile();

    service = await module.get(DatabaseInfoProvider);
    featureService = await module.get(FeatureService);
  });

  describe('getDatabasesCount', () => {
    it('get databases count', async () => {
      when(mockIORedisClient.call)
        .calledWith('config', ['get', 'databases'])
        .mockResolvedValue(['databases', '16']);

      const result = await service.getDatabasesCount(mockIORedisClient);

      expect(result).toBe(16);
    });
    it('get databases count for limited redis db', async () => {
      when(mockIORedisClient.call)
        .calledWith('config', ['get', 'databases'])
        .mockResolvedValue([]);

      const result = await service.getDatabasesCount(mockIORedisClient);

      expect(result).toBe(1);
    });
    it('failed to get databases config', async () => {
      when(mockIORedisClient.call)
        .calledWith('config', ['get', 'databases'])
        .mockRejectedValue(new Error("unknown command 'config'"));

      const result = await service.getDatabasesCount(mockIORedisClient);

      expect(result).toBe(1);
    });
  });

  describe('getClientListInfo', () => {
    it('get client list info', async () => {
      when(mockIORedisClient.call)
        .calledWith('client', ['list'])
        .mockResolvedValue(mockRedisClientList);

      const result = await service.getClientListInfo(mockIORedisClient);

      expect(result).toEqual(mockRedisClientListResult);
    });
    it('failed to get client list', async () => {
      when(mockIORedisClient.call)
        .calledWith('client', ['list'])
        .mockRejectedValue(new Error("unknown command 'client'"));

      try {
        await service.getClientListInfo(mockIORedisClient);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('getDatabaseCountFromKeyspace', () => {
    it('should return 1 since db0 keys presented only', async () => {
      const result = await service['getDatabaseCountFromKeyspace']({
        db0: 'keys=11,expires=0,avg_ttl=0',
      });

      expect(result).toBe(1);
    });
    it('should return 7 since db6 is the last logical databases with known keys', async () => {
      const result = await service['getDatabaseCountFromKeyspace']({
        db0: 'keys=21,expires=0,avg_ttl=0',
        db1: 'keys=31,expires=0,avg_ttl=0',
        db6: 'keys=41,expires=0,avg_ttl=0',
      });

      expect(result).toBe(7);
    });
    it('should return 1 when empty keySpace provided', async () => {
      const result = await service['getDatabaseCountFromKeyspace']({});

      expect(result).toBe(1);
    });
    it('should return 1 when incorrect keySpace provided', async () => {
      const result = await service['getDatabaseCountFromKeyspace'](null);

      expect(result).toBe(1);
    });
  });

  describe('determineDatabaseModules', () => {
    it('get modules by using MODULE LIST command (without filters)', async () => {
      when(mockIORedisClient.call)
        .calledWith('module', ['list'])
        .mockResolvedValue(mockRedisModuleList);

      const result = await service.determineDatabaseModules(mockIORedisClient);

      expect(mockIORedisClient.call).not.toHaveBeenCalledWith('command', expect.anything());
      expect(result).toEqual([
        { name: AdditionalRedisModuleName.RedisAI, version: 10000, semanticVersion: '1.0.0' },
        { name: AdditionalRedisModuleName.RedisGraph, version: 10000, semanticVersion: '1.0.0' },
        { name: AdditionalRedisModuleName.RedisGears, version: 10000, semanticVersion: '1.0.0' },
        { name: AdditionalRedisModuleName.RedisBloom, version: 10000, semanticVersion: '1.0.0' },
        { name: AdditionalRedisModuleName.RedisJSON, version: 10000, semanticVersion: '1.0.0' },
        { name: AdditionalRedisModuleName.RediSearch, version: 10000, semanticVersion: '1.0.0' },
        { name: AdditionalRedisModuleName.RedisTimeSeries, version: 10000, semanticVersion: '1.0.0' },
        { name: 'customModule', version: 10000, semanticVersion: undefined },
      ]);
    });
    it('get modules by using MODULE LIST command (with filters applied)', async () => {
      when(mockIORedisClient.call)
        .calledWith('module', ['list'])
        .mockResolvedValue(mockRedisModuleList);
      featureService.getByName.mockResolvedValue({
        flag: true,
        data: {
          hideByName: [
            {
              expression: 'rejSoN',
              options: 'i',
            },
          ],
        },
      });

      const result = await service.determineDatabaseModules(mockIORedisClient);

      expect(mockIORedisClient.call).not.toHaveBeenCalledWith('command', expect.anything());
      expect(result).toEqual([
        { name: AdditionalRedisModuleName.RedisAI, version: 10000, semanticVersion: '1.0.0' },
        { name: AdditionalRedisModuleName.RedisGraph, version: 10000, semanticVersion: '1.0.0' },
        { name: AdditionalRedisModuleName.RedisGears, version: 10000, semanticVersion: '1.0.0' },
        { name: AdditionalRedisModuleName.RedisBloom, version: 10000, semanticVersion: '1.0.0' },
        // { name: AdditionalRedisModuleName.RedisJSON, version: 10000, semanticVersion: '1.0.0' }, should be ignored
        { name: AdditionalRedisModuleName.RediSearch, version: 10000, semanticVersion: '1.0.0' },
        { name: AdditionalRedisModuleName.RedisTimeSeries, version: 10000, semanticVersion: '1.0.0' },
        { name: 'customModule', version: 10000, semanticVersion: undefined },
      ]);
    });
    it('detect all modules by using COMMAND INFO command (without filter)', async () => {
      when(mockIORedisClient.call)
        .calledWith('module', ['list'])
        .mockRejectedValue(mockUnknownCommandModule);
      when(mockIORedisClient.call)
        .calledWith('command', expect.anything())
        .mockResolvedValue([
          null,
          ['somecommand', -1, ['readonly'], 0, 0, -1, []],
        ]);

      const result = await service.determineDatabaseModules(mockIORedisClient);

      expect(mockIORedisClient.call).toHaveBeenCalledTimes(REDIS_MODULES_COMMANDS.size + 1);
      expect(result).toEqual([
        { name: AdditionalRedisModuleName.RedisAI },
        { name: AdditionalRedisModuleName.RedisGraph },
        { name: AdditionalRedisModuleName.RedisGears },
        { name: AdditionalRedisModuleName.RedisBloom },
        { name: AdditionalRedisModuleName.RedisJSON },
        { name: AdditionalRedisModuleName.RediSearch },
        { name: AdditionalRedisModuleName.RedisTimeSeries },
      ]);
    });
    it('detect all modules by using COMMAND INFO command (with filter)', async () => {
      when(mockIORedisClient.call)
        .calledWith('module', ['list'])
        .mockRejectedValue(mockUnknownCommandModule);
      when(mockIORedisClient.call)
        .calledWith('command', expect.anything())
        .mockResolvedValue([
          null,
          ['somecommand', -1, ['readonly'], 0, 0, -1, []],
        ]);
      featureService.getByName.mockResolvedValue({
        flag: true,
        data: {
          hideByName: [
            {
              expression: 'rejSoN',
              options: 'i',
            },
          ],
        },
      });

      const result = await service.determineDatabaseModules(mockIORedisClient);

      expect(mockIORedisClient.call).toHaveBeenCalledTimes(REDIS_MODULES_COMMANDS.size + 1);
      expect(result).toEqual([
        { name: AdditionalRedisModuleName.RedisAI },
        { name: AdditionalRedisModuleName.RedisGraph },
        { name: AdditionalRedisModuleName.RedisGears },
        { name: AdditionalRedisModuleName.RedisBloom },
        // { name: AdditionalRedisModuleName.RedisJSON }, should be ignored
        { name: AdditionalRedisModuleName.RediSearch },
        { name: AdditionalRedisModuleName.RedisTimeSeries },
      ]);
    });
    it('detect only RediSearch module by using COMMAND INFO command', async () => {
      when(mockIORedisClient.call)
        .calledWith('module', ['list'])
        .mockRejectedValue(mockUnknownCommandModule);
      when(mockIORedisClient.call)
        .calledWith('command', ['info', ...REDIS_MODULES_COMMANDS.get(AdditionalRedisModuleName.RediSearch)])
        .mockResolvedValue([['FT.INFO', -1, ['readonly'], 0, 0, -1, []]]);

      const result = await service.determineDatabaseModules(mockIORedisClient);

      expect(mockIORedisClient.call).toHaveBeenCalledTimes(REDIS_MODULES_COMMANDS.size + 1);
      expect(result).toEqual([
        { name: AdditionalRedisModuleName.RediSearch },
      ]);
    });
    it('should return empty array if MODULE LIST and COMMAND command not allowed', async () => {
      when(mockIORedisClient.call)
        .calledWith('module', ['list'])
        .mockRejectedValue(mockUnknownCommandModule);
      when(mockIORedisClient.call)
        .calledWith('command', expect.anything())
        .mockRejectedValue(mockUnknownCommandModule);

      const result = await service.determineDatabaseModules(mockIORedisClient);

      expect(result).toEqual([]);
    });
  });

  describe('determineDatabaseServer', () => {
    it('get modules by using MODULE LIST command', async () => {
      when(mockIORedisClient.call)
        .calledWith('info', ['server'])
        .mockResolvedValue(mockRedisServerInfoResponse);

      const result = await service.determineDatabaseServer(mockIORedisClient);

      expect(result).toEqual(mockRedisGeneralInfo.version);
    });
  });

  describe('getRedisGeneralInfo', () => {
    beforeEach(() => {
      service.getDatabasesCount = jest.fn().mockResolvedValue(16);
    });
    it('get general info for redis standalone', async () => {
      when(mockIORedisClient.info)
        .calledWith()
        .mockResolvedValue(mockStandaloneRedisInfoReply);

      const result = await service.getRedisGeneralInfo(mockIORedisClient);

      expect(result).toEqual(mockRedisGeneralInfo);
    });
    it('get general info for redis standalone without some optional fields', async () => {
      const reply: string = `${mockRedisServerInfoResponse
      }\r\n${
        mockRedisClientsInfoResponse
      }\r\n`;
      when(mockIORedisClient.info).calledWith().mockResolvedValue(reply);

      const result = await service.getRedisGeneralInfo(mockIORedisClient);

      expect(result).toEqual({
        ...mockRedisGeneralInfo,
        totalKeys: undefined,
        usedMemory: undefined,
        hitRatio: undefined,
        role: undefined,
      });
    });
    it('get general info for redis cluster', async () => {
      when(mockIOClusterNode1.info)
        .calledWith()
        .mockResolvedValue(mockStandaloneRedisInfoReply);
      when(mockIOClusterNode2.info)
        .calledWith()
        .mockResolvedValue(mockStandaloneRedisInfoReply);

      const result = await service.getRedisGeneralInfo(mockIORedisCluster);

      expect(result).toEqual({
        version: mockRedisGeneralInfo.version,
        totalKeys: mockRedisGeneralInfo.totalKeys * 2,
        usedMemory: mockRedisGeneralInfo.usedMemory * 2,
        nodes: [mockRedisGeneralInfo, mockRedisGeneralInfo],
      });
    });
    it('should throw an error if no permission to run \'info\' command', async () => {
      mockIORedisClient.info.mockRejectedValue({
        message: 'NOPERM this user has no permissions to run the \'info\' command',
      });

      try {
        await service.getRedisGeneralInfo(mockIORedisClient);
        fail('Should throw an error');
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
