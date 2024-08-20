import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtAuthGuard } from "@app/auth/guards/jwt.guards";
import { UsersMeta } from "../entities/users_meta.entity";
import { CreateUserDto } from "@app/users/dto/create_user.dto";
import { CreateUsersMetaDto } from "../dto/create-users_meta.dto";
import { User } from "@app/users/entities/user.entity";

describe("UsersMetaModule (integration)", () => {
  let app: INestApplication;
  let userMetaRepository: Repository<UsersMeta>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideGuard(JwtAuthGuard) // Override the AuthGuard to disable it
    .useValue({ canActivate: () => true }) // Allow all requests to pass through
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userMetaRepository = moduleFixture.get<Repository<UsersMeta>>(getRepositoryToken(UsersMeta));
  }, 10000);

  it("/users (POST) - success", async () => {
    const createUserMetaDto: CreateUsersMetaDto = {
        umetaId: 1,
        userId: 1,
        metaKey: 'test',
        metaValue: 'test'
    };

    const response = await request(app.getHttpServer())
      .post("/users-meta")
      .send(createUserMetaDto);

    expect(response.status).toBe(201);

    const userMeta = await userMetaRepository.findOne({ where: { userId: createUserMetaDto.userId } });
    expect(userMeta).toBeDefined();
    expect(userMeta?.userId).toBe(createUserMetaDto.userId);
  });

  it("/users/:id (GET) - should return a single user by ID", async () => {
    const createUserMetaDto: Partial<CreateUsersMetaDto> = {
        umetaId: 1,
    };

    await userMetaRepository.save(createUserMetaDto);

    console.log(` umeta ID : ${createUserMetaDto.umetaId}`)

    const response = await request(app.getHttpServer())
      .get(`/users-meta/${createUserMetaDto.umetaId}`)
      .expect(200);

    console.log(response.body)
    expect(response.body.umetaId).toBe(createUserMetaDto.umetaId);
  });

  it("/users/:id (PATCH) - should update a user", async () => {
    const createUserMetaDto: CreateUsersMetaDto = {
        umetaId: 1,
        userId: 1,
        metaKey: 'test',
        metaValue: 'test'
    };

    await userMetaRepository.save(createUserMetaDto);

    const updateUsersMetaDto = {
    userId: 1,
      metaKey: "Updated meta kay",
      metaValue: "Updated meta value",
    };

    await request(app.getHttpServer())
      .patch(`/users-meta/${createUserMetaDto.userId}`)
      .send(updateUsersMetaDto)
      .expect(200);

    const updatedUser = await userMetaRepository.findOne({ where: { userId: updateUsersMetaDto.userId} });
    expect(updatedUser?.metaKey).toBe(updateUsersMetaDto.metaKey);
    expect(updatedUser?.metaValue).toBe(updateUsersMetaDto.metaValue);
  });

  it("/users/:id (DELETE) - should delete a user", async () => {
    const createUserMetaDto: Partial<CreateUsersMetaDto> = {
        umetaId: 1,
    };

    await userMetaRepository.save(createUserMetaDto);

    await request(app.getHttpServer())
      .delete(`/users-meta/${createUserMetaDto.umetaId}`)
      .expect(200);

    const userMeta = await userMetaRepository.findOne({ where: { umetaId: createUserMetaDto.umetaId } });
    expect(userMeta).toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
