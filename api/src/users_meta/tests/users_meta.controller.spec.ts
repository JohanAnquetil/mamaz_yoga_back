import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException, HttpException } from '@nestjs/common';
import { UsersMetaController } from '../users_meta.controller';
import { UsersMetaService } from '../users_meta.service';
import { CreateUsersMetaDto } from '../dto/create-users_meta.dto';
import { UsersMeta } from '../entities/users_meta.entity';
import { UpdateUsersMetaDto } from '../dto/update-users_meta.dto';

describe('UsersMetasController', () => {
  let controller: UsersMetaController
  let service: UsersMetaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersMetaController],
      providers: [
        {
          provide: UsersMetaService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersMetaController>(UsersMetaController);
    service = module.get<UsersMetaService>(UsersMetaService);
  });

  describe('create', () => {
    it('should call the service to create a new post meta', async () => {
      const createUsersMetaDto: CreateUsersMetaDto = { umetaId: 1, userId: 1, metaKey: 'test', metaValue: 'value' };
      await controller.create(createUsersMetaDto);
      expect(service.create).toHaveBeenCalledWith(createUsersMetaDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of post meta entries', async () => {
      const mockUsersMeta = [{ umetaId: 1, userId: 1, metaKey: 'test', metaValue: 'value' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockUsersMeta as UsersMeta[]);

      const result = await controller.findAll();
      expect(result).toEqual(mockUsersMeta);
    });
  });

  describe('findOne', () => {
    it('should return a single post meta by ID', async () => {
      const mockUsersMeta = { umetaId: 1, userId: 1, metaKey: 'test', metaValue: 'value' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUsersMeta as UsersMeta);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockUsersMeta);
    });

    it('should throw a NotFoundException if the post meta is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should rethrow HttpException if one is thrown by the service', async () => {
      const httpException = new HttpException('Error occurred', 500);
      jest.spyOn(service, 'findOne').mockImplementation(() => {
        throw httpException;
      });

      await expect(controller.findOne('1')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should call the service to update a post meta', async () => {
      const updateUsersMetaDto: UpdateUsersMetaDto = { metaKey: 'updated', metaValue: 'updated value' };
      jest.spyOn(service, 'update').mockResolvedValue(1);

      const result = await controller.update('1', updateUsersMetaDto);
      expect(service.update).toHaveBeenCalledWith(1, updateUsersMetaDto);
      expect(result).toBe(1);
    });
  });

  describe('remove', () => {
    it('should call the service to remove a post meta', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
