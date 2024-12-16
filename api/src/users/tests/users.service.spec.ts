// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from '../users.service';
// import { User } from '../entities/user.entity';
// import { Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { NotFoundException } from '@nestjs/common';
// import { CreateUserDto } from '../dto/create_user.dto';
// import { UpdateUserDto } from '../dto/update_user.dto';
// import { UsersMeta } from '@app/users_meta/entities/users_meta.entity';
// import { SubscriptionPlansService } from '@app/subscription_plans/subscription_plans.service';

// describe('UsersService', () => {
//   let usersService: UsersService;
//   let usersRepository: Repository<User>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: getRepositoryToken(User),
//           useClass: Repository,
//         },
//         {provide: SubscriptionPlansService, // Mock the SubscriptionPlansService
//         useValue: {
//           // Add mocked methods that you use in your service
//           loadIdsSubscriptionPlans: jest.fn().mockResolvedValue([]),
//         },}
//       ],
//     }).compile();

//     usersService = module.get<UsersService>(UsersService);
//     usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
//   });

//   describe('create', () => {
//     it('should save a new user', async () => {
//       const createUserDto: CreateUserDto = {
//         id: 1,
//         userLogin: 'testuser',
//         userEmail: 'testuser@example.com',
//         userPass: 'testpass',
//         userStatus:1,
//         displayName:'Elsa',
//         userNicename: 'Elsa'
//       };

//       jest.spyOn(usersRepository, 'save').mockResolvedValue(createUserDto as any);

//       await usersService.create(createUserDto);
//       expect(usersRepository.save).toHaveBeenCalledWith(createUserDto);
//     });
//   });

//   describe('findAll', () => {
//     it('should return an array of users', async () => {
//       const result: User[] = [
//         {
//             id: 1,
//             userLogin: 'testuser',
//             userEmail: 'testuser@example.com',
//             userPass: 'testpass',
//             userStatus: 1,
//             displayName: 'Elsa',
//             userNicename: 'Elsa',
//             userRegistered: new Date(), // Par défaut, cette propriété ne devrait pas être undefined
//             usersMetas: [],
//         }
//       ];
//       jest.spyOn(usersRepository, 'find').mockResolvedValue(result);

//       expect(await usersService.findAll()).toEqual({
//         message: "Des utilisateurs ont été trouvés",
//         data: result,
//       });
//     });

//     it('should return a message if no users are found', async () => {
//       jest.spyOn(usersRepository, 'find').mockResolvedValue([]);

//       // Verify that the controller returns the expected result
//       expect(await usersService.findAll()).toBe("Aucun utilisateur a été trouvé");
//     });
//   });

//   // Test the findOne method
//   describe('findOne', () => {
//     it('should return a user by ID', async () => {
//       const user = {
//         id: 1,
//         userEmail: 'testuser@example.com',
//         userLogin: 'testuser',
//       } as User;

//       // Mock the findOne method of the service to return the result
//       jest.spyOn(usersRepository, 'createQueryBuilder').mockReturnValue({
//         where: jest.fn().mockReturnThis(),
//         leftJoinAndSelect: jest.fn().mockReturnThis(),
//         getOne: jest.fn().mockResolvedValue(user),
//       } as any);

//       const result = await usersService.findOne(1);
//       expect(result.data.email).toBe(user.userEmail);
//     });

//     it('should throw NotFoundException if user is not found', async () => {
//       jest.spyOn(usersRepository, 'createQueryBuilder').mockReturnValue({
//         where: jest.fn().mockReturnThis(),
//         leftJoinAndSelect: jest.fn().mockReturnThis(),
//         getOne: jest.fn().mockResolvedValue(undefined),
//       } as any);

//       await expect(usersService.findOne(1)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('update', () => {
//     it('should update a user and return a confirmation message', async () => {
//       const updateUserDto: UpdateUserDto = {
//         userEmail: 'newemail@example.com',
//       };

//       jest.spyOn(usersRepository, 'update').mockResolvedValue({ affected: 1 } as any);

//       const result = await usersService.update(1, updateUserDto);
//       expect(result).toBe(`This action updates a #1 user`);
//     });
//   });

//   describe('remove', () => {
//     it('should delete a user', async () => {
//       jest.spyOn(usersRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

//       const result = await usersService.remove(1);
//       expect(result).toBeUndefined();
//     });
//   });
// });
