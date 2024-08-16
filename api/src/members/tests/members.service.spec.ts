import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from '../members.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../entities/member.entity';
import { EntityManager, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
  

  describe('MembersService', () => {
    let service: MembersService;
    let repository: Repository<Member>;
    let entityManager: EntityManager;

    // Setup the testing module and inject dependencies before each test
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          MembersService,
          {
            provide: getRepositoryToken(Member),
            useClass: Repository, // Provide a mock Repository
          },
          {
            provide: EntityManager,
            useValue: {
              save: jest.fn(),// Mock the save method of EntityManager
            },
          },
        ],
      }).compile();

      // Retrieve instances of the service and dependencies
      service = module.get<MembersService>(MembersService);
      repository = module.get<Repository<Member>>(getRepositoryToken(Member));
      entityManager = module.get<EntityManager>(EntityManager);
    });

    // Verify that the service is defined
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    // Test the create method
  describe('create', () => {
    it('should successfully create a new member', async () => {
      const createMemberDto = { arm_member_id: 1, arm_user_login: 'test' } as Member;
      jest.spyOn(repository, 'save').mockResolvedValueOnce(createMemberDto);

      await expect(service.create(createMemberDto)).resolves.not.toThrow();
    });
  });

  // Test the findAll method
  describe('findAll', () => {
    it('should return an array of members', async () => {
      const membersArray = [
        new Member({ arm_member_id: 1, arm_user_login: 'test1' }),
        new Member({ arm_member_id: 2, arm_user_login: 'test2' }),
      ];
  
      jest.spyOn(repository, 'find').mockResolvedValueOnce(membersArray);
  
      const result = await service.findAll();
      expect(result).toEqual({
        message: 'Des membres ont été trouvés',
        data: membersArray,
      });
    });
  
    it('should return "Aucun membre trouvé" if no members exist', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
  
      const result = await service.findAll();
      expect(result).toEqual('Aucun membre trouvé');
    });
  });
// Test the findOne method
  describe('findOne', () => {
    it('should return a member if found', async () => {
      const member = new Member({ arm_member_id: 1, arm_user_login: 'test1' }); // Fournir les arguments nécessaires
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(member);

      const result = await service.findOne(1);
      expect(result).toEqual({
        message: 'le membre a été trouvé',
        data: member,
      });
    });

    it('should throw NotFoundException if member not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
// Test the update method
  describe('update', () => {
    it('should update a member and return affected rows', async () => {
      const updateResult = { affected: 1 } as any;
      jest.spyOn(repository, 'update').mockResolvedValueOnce(updateResult);

      const result = await service.update(1, {});
      expect(result).toEqual(1);
    });

    it('should throw NotFoundException if no rows affected', async () => {
      const updateResult = { affected: 0 } as any;
      jest.spyOn(repository, 'update').mockResolvedValueOnce(updateResult);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  // Test the delete method
  describe('delete', () => {
    it('should delete a member', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce({} as any);

      await expect(service.delete(1)).resolves.toEqual('Le membre a bien été effacé');
    });
  });
});
