import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MembersController } from '@app/members/members.controller';
import { MembersService } from '@app/members/members.service';
import { Member } from '@app/members/entities/member.entity';

describe('MembersController', () => {
  let membersController: MembersController;
  let membersService: MembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: MembersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    membersController = module.get<MembersController>(MembersController);
    membersService = module.get<MembersService>(MembersService);
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const result = { message: 'Des membres ont été trouvés', data: [] };
      jest.spyOn(membersService, 'findAll').mockResolvedValue(result);

      expect(await membersController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single member by ID', async () => {
      const result = { message: 'le membre a été trouvé', data: {} as Member };
      jest.spyOn(membersService, 'findOne').mockResolvedValue(result);

      expect(await membersController.findOne(1)).toBe(result);
    });

    it('should throw a NotFoundException if the member is not found', async () => {
      jest.spyOn(membersService, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(membersController.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should call the service create method with the correct arguments', async () => {
      const member = {} as Member;
      await membersController.create(member);
      expect(membersService.create).toHaveBeenCalledWith(member);
    });
  });

  describe('update', () => {
    it('should call the service update method and handle not found exception', async () => {
      jest.spyOn(membersService, 'update').mockResolvedValue(1);

      await membersController.update(1, {} as any);
      expect(membersService.update).toHaveBeenCalledWith(1, {} as any);
    });

    it('should throw a NotFoundException if the update affects no rows', async () => {
      jest.spyOn(membersService, 'update').mockResolvedValue(0);

      await expect(membersController.update(1, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should call the service delete method and return confirmation', async () => {
      jest.spyOn(membersService, 'delete').mockResolvedValue('Membre effacé !');

      expect(await membersController.delete(1)).toBe('Membre effacé !');
    });
  });
});
