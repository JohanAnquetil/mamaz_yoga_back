import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from "../dto/create_user.dto";
import { JwtAuthGuard } from "@app/auth/guards/jwt.guards";

describe("UsersModule (integration)", () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideGuard(JwtAuthGuard) // Override the AuthGuard to disable it
    .useValue({ canActivate: () => true }) // Allow all requests to pass through
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  }, 10000);

  it("/users (POST) - success", async () => {
    const createUserDto: CreateUserDto = {
      id: 1,
      userLogin: "testuser",
      userPass: "password",
      userNicename: "testuser",
      userEmail: "testuser@example.com",
      userStatus: 0,
      displayName: "Test User",
      userRegistered: new Date(),
    };

    const response = await request(app.getHttpServer())
      .post("/users")
      .send(createUserDto);

    expect(response.status).toBe(201);

    const user = await userRepository.findOne({ where: { id: createUserDto.id } });
    expect(user).toBeDefined();
    expect(user?.userLogin).toBe(createUserDto.userLogin);
  });

  it("/users/:id (GET) - should return a single user by ID", async () => {
    const createUserDto: CreateUserDto = {
      id: 2,
      userLogin: "anotheruser",
      userPass: "password",
      userNicename: "anotheruser",
      userEmail: "anotheruser@example.com",
      userStatus: 0,
      displayName: "Another User",
      userRegistered: new Date(),
    };

    await userRepository.save(createUserDto);

    const response = await request(app.getHttpServer())
      .get(`/users/${createUserDto.id}`)
      .expect(200);

    const { body } = response;
    expect(body.data.login).toBe(createUserDto.userLogin);
  });

  it("/users/:id (PATCH) - should update a user", async () => {
    const createUserDto: CreateUserDto = {
      id: 3,
      userLogin: "updateuser",
      userPass: "password",
      userNicename: "updateuser",
      userEmail: "updateuser@example.com",
      userStatus: 0,
      displayName: "Update User",
      userRegistered: new Date(),
    };

    await userRepository.save(createUserDto);

    const updateUserDto = {
      displayName: "Updated User Name",
      userEmail: "updateduser@example.com",
    };

    await request(app.getHttpServer())
      .patch(`/users/${createUserDto.id}`)
      .send(updateUserDto)
      .expect(200);

    const updatedUser = await userRepository.findOne({ where: { id: createUserDto.id } });
    expect(updatedUser?.displayName).toBe(updateUserDto.displayName);
    expect(updatedUser?.userEmail).toBe(updateUserDto.userEmail);
  });

  it("/users/:id (DELETE) - should delete a user", async () => {
    const createUserDto: CreateUserDto = {
      id: 4,
      userLogin: "deleteuser",
      userPass: "password",
      userNicename: "deleteuser",
      userEmail: "deleteuser@example.com",
      userStatus: 0,
      displayName: "Delete User",
      userRegistered: new Date(),
    };

    await userRepository.save(createUserDto);

    await request(app.getHttpServer())
      .delete(`/users/${createUserDto.id}`)
      .expect(200);

    const user = await userRepository.findOne({ where: { id: createUserDto.id } });
    expect(user).toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
