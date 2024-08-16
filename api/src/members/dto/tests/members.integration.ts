import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../../app.module";
import { Repository } from "typeorm";
import { Member } from "../../entities/member.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateMemberDto } from "../../dto/create-member.dto";
//
describe("MembersController (e2e)", () => {
  let app: INestApplication;
  let memberRepository: Repository<Member>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    memberRepository = moduleFixture.get<Repository<Member>>(getRepositoryToken(Member));
  });

  afterEach(async () => {
    await memberRepository.clear(); // Nettoie la base de données après chaque test
  });

  afterAll(async () => {
    await app.close();
  });

  it("/members (POST) - success", async () => {
    const createMemberDto: CreateMemberDto = {
      arm_member_id: 1,
      arm_user_id: 1,
      arm_user_login: "testuser",
      arm_user_pass: "password",
      arm_user_nicename: "Test User",
      arm_user_email: "testuser@example.com",
      arm_user_url: "http://example.com",
      arm_user_registered: new Date(),
      arm_user_status: 1,
      arm_secondary_status: 1,
      arm_user_plan_ids: "1",
      arm_user_suspended_plan_ids: "2",
    };

    const response = await request(app.getHttpServer())
      .post("/members")
      .send(createMemberDto)
      .expect(201);

    const member = await memberRepository.findOne({ where: { arm_member_id: createMemberDto.arm_member_id } });
    expect(member).toBeDefined();
    expect(member?.arm_user_login).toBe(createMemberDto.arm_user_login);
  });

  it("/members (GET) - should return an array of members", async () => {
    const createMemberDto: CreateMemberDto = {
      arm_member_id: 1,
      arm_user_id: 1,
      arm_user_login: "testuser",
      arm_user_pass: "password",
      arm_user_nicename: "Test User",
      arm_user_email: "testuser@example.com",
      arm_user_url: "http://example.com",
      arm_user_registered: new Date(),
      arm_user_status: 1,
      arm_secondary_status: 1,
      arm_user_plan_ids: "1",
      arm_user_suspended_plan_ids: "2",
    };

    await memberRepository.save(createMemberDto);

    const response = await request(app.getHttpServer())
      .get("/members")
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].arm_user_login).toBe(createMemberDto.arm_user_login);
  });

  it("/members/:id (GET) - should return a single member by ID", async () => {
    const createMemberDto: CreateMemberDto = {
      arm_member_id: 1,
      arm_user_id: 1,
      arm_user_login: "testuser",
      arm_user_pass: "password",
      arm_user_nicename: "Test User",
      arm_user_email: "testuser@example.com",
      arm_user_url: "http://example.com",
      arm_user_registered: new Date(),
      arm_user_status: 1,
      arm_secondary_status: 1,
      arm_user_plan_ids: "1",
      arm_user_suspended_plan_ids: "2",
    };

    await memberRepository.save(createMemberDto);

    const response = await request(app.getHttpServer())
      .get(`/members/${createMemberDto.arm_member_id}`)
      .expect(200);

    expect(response.body.data.arm_user_login).toBe(createMemberDto.arm_user_login);
  });

  it("/members/:id (PUT) - should update a member", async () => {
    const createMemberDto: CreateMemberDto = {
      arm_member_id: 1,
      arm_user_id: 1,
      arm_user_login: "testuser",
      arm_user_pass: "password",
      arm_user_nicename: "Test User",
      arm_user_email: "testuser@example.com",
      arm_user_url: "http://example.com",
      arm_user_registered: new Date(),
      arm_user_status: 1,
      arm_secondary_status: 1,
      arm_user_plan_ids: "1",
      arm_user_suspended_plan_ids: "2",
    };

    await memberRepository.save(createMemberDto);

    const updateMemberDto = {
      arm_user_login: "updateduser",
    };

    await request(app.getHttpServer())
      .put(`/members/${createMemberDto.arm_member_id}`)
      .send(updateMemberDto)
      .expect(200);

    const updatedMember = await memberRepository.findOne({ where: { arm_member_id: createMemberDto.arm_member_id } });
    expect(updatedMember?.arm_user_login).toBe(updateMemberDto.arm_user_login);
  });

  it("/members/:id (DELETE) - should delete a member", async () => {
    const createMemberDto: CreateMemberDto = {
      arm_member_id: 1,
      arm_user_id: 1,
      arm_user_login: "testuser",
      arm_user_pass: "password",
      arm_user_nicename: "Test User",
      arm_user_email: "testuser@example.com",
      arm_user_url: "http://example.com",
      arm_user_registered: new Date(),
      arm_user_status: 1,
      arm_secondary_status: 1,
      arm_user_plan_ids: "1",
      arm_user_suspended_plan_ids: "2",
    };

    await memberRepository.save(createMemberDto);

    await request(app.getHttpServer())
      .delete(`/members/${createMemberDto.arm_member_id}`)
      .expect(200);

    const member = await memberRepository.findOne({ where: { arm_member_id: createMemberDto.arm_member_id } });
    expect(member).toBeNull();
  });
});
