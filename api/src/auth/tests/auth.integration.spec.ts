import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { AuthService } from "../auth.service";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
  }, 10000);

  it("/login (POST) - success", async () => {
    const loginData = { username: "ElsaB", password: "azerty" };

    const response = await request(app.getHttpServer())
      .post("/login")
      .send(loginData)
      .expect(201);

    const { body } = response;
    expect(body).toHaveProperty("message", "L'authentification est validée");
    expect(body).toHaveProperty("token");
  });

  afterAll(async () => {
    await app.close();
  });
});
