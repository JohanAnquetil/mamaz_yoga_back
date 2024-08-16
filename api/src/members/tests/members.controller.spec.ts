import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from '../members.controller';
import { MembersService } from '../members.service';
import { Member } from '../entities/member.entity';
import { NotFoundException } from '@nestjs/common';

describe('MembersController', () => {
  let controller: MembersController;
  let service: MembersService;

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

    controller = module.get<MembersController>(MembersController);
    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const membersArray = [
        new Member({ arm_member_id: 1, arm_user_login: 'test1' }),
        new Member({ arm_member_id: 2, arm_user_login: 'test2' }),
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue({
        message: 'Des membres ont été trouvés',
        data: membersArray,
      });

      const result = await controller.findAll();
      expect(result).toEqual({
        message: 'Des membres ont été trouvés',
        data: membersArray,
      });
    });
  });

  describe('findOne', () => {
    it('should return a member if found', async () => {
      const member = new Member({ arm_member_id: 1, arm_user_login: 'test1' });
      jest.spyOn(service, 'findOne').mockResolvedValue({
        message: 'le membre a été trouvé',
        data: member,
      });

      const result = await controller.findOne(1);
      expect(result).toEqual({
        message: 'le membre a été trouvé',
        data: member,
      });
    });

    it('should throw NotFoundException if member not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a member', async () => {
      const member = new Member({ arm_member_id: 1, arm_user_login: 'test1' });
      jest.spyOn(service, 'create').mockResolvedValue(undefined);

      await expect(controller.create(member)).resolves.not.toThrow();
      expect(service.create).toHaveBeenCalledWith(member);
    });
  });

  describe('update', () => {
    it('should update a member', async () => {
      const updateDto = { arm_user_login: 'updatedLogin' };
      jest.spyOn(service, 'update').mockResolvedValue(1);

      await expect(controller.update(1, updateDto)).resolves.not.toThrow();
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException if member not found for update', async () => {
      const updateDto = { arm_user_login: 'updatedLogin' };
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update(1, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a member', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue('Membre effacé !');

      const result = await controller.delete(1);
      expect(result).toEqual('Membre effacé !');
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
