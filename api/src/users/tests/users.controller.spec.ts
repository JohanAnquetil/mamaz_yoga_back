import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create_user.dto';
import { UpdateUserDto } from '../dto/update_user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

// Initialize the testing module and mock dependencies before each test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
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
    // Get instances of UsersController and UsersService from the testing module    
    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  // Test the create method
  describe('create', () => {
    it('should call the usersService create method with the correct arguments', async () => {
      const createUserDto: CreateUserDto = {
        id: 1,
        userLogin: 'testuser',
        userEmail: 'testuser@example.com',
        userPass: 'testpass',
        userStatus:1,
        displayName:'Elsa',
        userNicename: 'Elsa'
      };

      // Call the create method of the controller
      await usersController.create(createUserDto);
      // Verify that the service's create method was called with the correct arguments
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  // Test the findAll method
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [
        {
            id: 1,
            userLogin: 'testuser',
            userEmail: 'testuser@example.com',
            userPass: 'testpass',
            user_status: 1,
            userRegistered: new Date(),
            usersMeta: []
        },
      ];
  
      jest.spyOn(usersService, 'findAll').mockResolvedValue(result);
  
      expect(await usersController.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      const result = {
        message: 'Données du client trouvées',
        data: { id: 1, email: 'testuser@example.com' },
      };
      // Mock the findOne method of the service to return the result
      jest.spyOn(usersService, 'findOne').mockResolvedValue(result);
        // Mock the findOne method of the service to return the result
      expect(await usersController.findOne('1')).toBe(result);
    });

    it('should throw an exception if the user is not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(undefined);

      await expect(usersController.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
  
// Test the update method
  describe('update', () => {
    it('should update a user and return a confirmation message', async () => {
      const updateUserDto: UpdateUserDto = {
        userEmail: 'newemail@example.com',
      };
      const result = `This action updates a #1 user`;
      jest.spyOn(usersService, 'update').mockResolvedValue(result);

      expect(await usersController.update('1', updateUserDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete a user and return a confirmation message', async () => {
      jest.spyOn(usersService, 'remove').mockResolvedValue(undefined);

      expect(await usersController.remove('1')).toBeUndefined();
    });
  });
});
