import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserLogin } from '../dto/user_login.dto';
import { AuthenticatedUserDto } from '../dto/authentificated_user.dto';
import { hashPassword } from '../utils/hash_verify_password';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return user data and token if user is premium', async () => {
        const hashedPassword = await hashPassword("azerty");
      const mockUser: UserLogin = {
        id: 1,
        userLogin: 'ElsaB',
        userNicename: 'ElsaB',
        userEmail: 'elsab@example.com',
        displayName: 'Elsa B.',
        is_premium: true,
        userPass: hashedPassword as string,
        userStatus: 1
      };
      const mockToken = 'valid-jwt-token';

      jest.spyOn(authService, 'generateToken').mockReturnValue(mockToken);

      const req = { user: mockUser };

      const result: AuthenticatedUserDto = authController.login(req);

      expect(result).toEqual({
        message: "L'authentification est validée",
        data: {
          id: mockUser.id,
          is_premium: mockUser.is_premium,
          username: mockUser.userNicename,
          email: mockUser.userEmail,
          nicename: mockUser.userNicename,
          name: mockUser.displayName,
        },
        token: mockToken,
      });
      expect(authService.generateToken).toHaveBeenCalledWith(mockUser);
    });

    it('should return user data without token if user is not premium', async () => {
    const hashedPassword = await hashPassword("azerty");
      const mockUser: UserLogin = {
        id: 2,
        userLogin: 'ElsaB',
        userNicename: 'ElsaB',
        userEmail: 'ElsaB@example.com',
        displayName: 'ElsaB.',
        is_premium: false,
        userPass: hashedPassword as string,
        userStatus: 1
      };

      const req = { user: mockUser };

      const result: AuthenticatedUserDto = authController.login(req);

      expect(result).toEqual({
        message: "L'authentification est validée",
        data: {
          id: mockUser.id,
          is_premium: mockUser.is_premium,
          username: mockUser.userNicename,
          email: mockUser.userEmail,
          nicename: mockUser.userNicename,
          name: mockUser.displayName,
        },
        token: undefined,
      });
      expect(authService.generateToken).not.toHaveBeenCalled();
    });
  });
});
