// import { User } from "@app/users/entities/user.entity";
// import { UsersService } from "@app/users/users.service";
// import { HttpException, HttpStatus } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { Test, TestingModule } from "@nestjs/testing";
// import * as jwt from "jsonwebtoken";
// import { AuthService } from "../auth.service";
// import { UserWithPremium } from "../dto/user_with_premium.dto";
// import { hashPassword } from "../utils/hash_verify_password";

// describe("AuthService", () => {
//   let authService: AuthService;
//   let usersService: UsersService;

//   // Setup before each test case
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: UsersService,
//           useValue: {
//             findOneByLogin: jest.fn(),
//             findOne: jest.fn(),
//           },
//         },
//         {
//           provide: JwtService,
//           useValue: new JwtService({
//             secret: "abc123",
//           }),
//         },
//       ],
//     }).compile();

//     authService = module.get<AuthService>(AuthService);
//     usersService = module.get<UsersService>(UsersService);
//   });

//   it("should validate a user and return user data if credentials are valid", async () => {
//     // Hash the password to simulate stored password
//     const hashedPassword = await hashPassword("azerty");

//     const mockUser = {
//       id: 1,
//       userLogin: "ElsaB",
//       userPass: hashedPassword,
//       userNicename: "Test User",
//       userEmail: "test@example.com",
//       is_premium: true,
//       userRegistered: new Date(),
//       userStatus: 0,
//       displayName: "Test User",
//       usersMetas: [],
//     } as UserWithPremium & User; // Cast as UserWithPremium and User

//     // Mock the response of the usersService methods
//     jest.spyOn(usersService, "findOneByLogin").mockResolvedValue(mockUser);
//     jest.spyOn(usersService, "findOne").mockResolvedValue({
//       data: { has_active_premium_subscription: true },
//     });

//     // Validate user credentials
//     const result = await authService.validateUser({
//       username: "ElsaB",
//       password: "azerty",
//     });

//     // Expect the result to match the mock user data
//     expect(result).toEqual(mockUser);
//   });

//   it("should throw an exception if credentials are invalid", async () => {
//     // Mock findOneByLogin to return null (user not found)
//     jest.spyOn(usersService, "findOneByLogin").mockResolvedValue(null);

//     // Expect an exception when credentials are invalid
//     await expect(
//       authService.validateUser({
//         username: "invaliduser",
//         password: "invalidpassword",
//       }),
//     ).rejects.toThrow(
//       new HttpException(
//         `Utilisateur ou mot de passe inconnu`,
//         HttpStatus.UNAUTHORIZED,
//       ),
//     );
//   });

//   it("should generate a JWT token with correct payload if credentials are valid", async () => {
//     // Mock user data with the hashed password
//     const mockUser = {
//       id: 1,
//       userLogin: "ElsaB",
//       userPass: "$P$B9eef2y3PpbHbh7tWMGcI7dTRxLPO0.",
//       userNicename: "Test User",
//       userEmail: "test@example.com",
//       is_premium: true,
//       userStatus: 0,
//       displayName: "Test User",
//       usersMetas: [],
//     } as UserWithPremium & User;

//     // Mock the response of the usersService methods
//     jest.spyOn(usersService, "findOneByLogin").mockResolvedValue(mockUser);
//     jest.spyOn(usersService, "findOne").mockResolvedValue({
//       data: { has_active_premium_subscription: true },
//     });

//     // Generate JWT token for the mock user
//     const token = authService.generateToken(mockUser);

//     // Expect the token to be defined
//     expect(token).toBeDefined();

//     // Decode the token and validate its payload
//     const decoded = jwt.decode(token) as { id: number; is_premium: boolean };

//     // Expect the decoded token to have correct properties
//     expect(decoded).toHaveProperty("id", mockUser.id);
//     expect(decoded).toHaveProperty("is_premium", mockUser.is_premium);
//   });
// });
