import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';
import { AppModule } from '@app/app.module';
import { User } from '@app/users/entities/user.entity';
import { hashPassword } from '../utils/hash_verify_password';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import the main app module
    }).compile();

    app = moduleFixture.createNestApplication(); // Create the app instance
    await app.init(); // Initialize the app

    // Get the repository for the User entity
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  }, 10000); // Increase timeout to handle potentially slow setup

  afterAll(async () => {
    await app.close(); // Close the application after tests
  });

  it('/login (POST) should authenticate and return a token for a premium user', async () => {
    // Create a premium user in the database
    const passHashed = await hashPassword("azerty")
    const user = userRepository.create({
      id:1,
      user_id: 1,
      userLogin: 'ElsaB',
      userPass: passHashed,
      userNicename: 'Test User',
      userEmail: 'test@example.com',
      userStatus: 1,
      displayName: 'elsa',
      //usersMetas: [],
      is_premium: true,
      userRegistered: new Date(),
    } as Partial<User>);
    await userRepository.save(user);

    const response = await request(app.getHttpServer())
      .post('/login')
      .send({ username: 'ElsaB', password: 'azerty' });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: 1,
        username: 'Test User',
        email: 'test@example.com',
        is_premium: false,
        nicename: "Test User"
      }),
    );
  });

  it('/login (POST) should return 401 for invalid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/login')
      .send({ username: 'invaliduser', password: 'invalidpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Utilisateur ou mot de passe inconnu');
  });
});
