import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest'; // Import 'supertest' correctly
import { JwtAuthGuard } from '@app/auth/guards/jwt.guards';
import { Member } from '../entities/member.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '@app/app.module';

describe('MembersModule (e2e)', () => {
  let app: INestApplication;
  let memberRepository: Repository<Member>;

  // Before all tests, initialize the NestJS application and get the PostNews repository
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard) // Override the AuthGuard to disable it
      .useValue({ canActivate: () => true }) // Allow all requests to pass through
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    memberRepository = moduleFixture.get<Repository<Member>>(getRepositoryToken(Member));
  }, 10000);

  afterAll(async () => {
    await app.close();
  });

  describe('/members (POST)', () => {
    it('should create a new member', async () => {
      const createMemberDto = {
        arm_member_id: 1,
        arm_user_login: 'testuser',
        arm_user_email: 'testuser@example.com',
        arm_user_pass: 'password',
        arm_user_status: 1,
        arm_user_registered: new Date(),
        arm_user_url: '',
        arm_user_nicename: 'Test User',
        arm_secondary_status: 1,
        arm_user_id: 1
      };

      const response = await request(app.getHttpServer())
        .post('/members')
        .send(createMemberDto)
        .expect(201); // Expect HTTP status 201 for successful creation

      expect(response.body).toBeDefined(); // Ensure response body is defined
      expect(await memberRepository.findOneBy({ arm_member_id: 1 })).not.toBeNull(); // Verify member is created
    });
  });

  describe('/members (GET)', () => {
    it('should return an array of members', async () => {
      const response = await request(app.getHttpServer())
        .get('/members')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.data).toBeInstanceOf(Array); // Expect the response data to be an array
    });
  });

  describe('/members/:id (GET)', () => {
    it('should return a single member by ID', async () => {
      const member = await memberRepository.save({
        arm_member_id: 2,
        arm_user_login: 'anotheruser',
        arm_user_email: 'anotheruser@example.com',
        arm_user_pass: 'password',
        arm_user_status: 1,
        arm_user_registered: new Date(),
        arm_user_url: '',
        arm_user_nicename: 'Another User',
        arm_secondary_status: 1,
        arm_user_id: 1
      });

      const response = await request(app.getHttpServer())
        .get(`/members/${member.arm_member_id}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.data.arm_member_id).toEqual(member.arm_member_id); // Ensure the correct member is returned
    });

    it('should return 404 if the member is not found', async () => {
      await request(app.getHttpServer())
        .get('/members/999')
        .expect(404); // Expect a 404 status if the member does not exist
    });
  });

  describe('/members/:id (PUT)', () => {
    it('should update a member', async () => {
      const member = await memberRepository.save({
        arm_member_id: 3,
        arm_user_login: 'updateuser',
        arm_user_email: 'updateuser@example.com',
        arm_user_pass: 'password',
        arm_user_status: 1,
        arm_user_registered: new Date(),
        arm_user_url: '',
        arm_user_nicename: 'Update User',
        arm_secondary_status: 1,
        arm_user_id: 1
      });

      const updateMemberDto = {
        arm_user_login: 'updateduser',
        arm_user_email: 'updateduser@example.com',
      };

      const response = await request(app.getHttpServer())
        .put(`/members/${member.arm_member_id}`)
        .send(updateMemberDto)
        .expect(200); // Expect HTTP status 200 for successful update

      expect(response.body).toBeDefined();
      const updatedMember = await memberRepository.findOneBy({ arm_member_id: member.arm_member_id });
      expect(updatedMember!.arm_user_login).toEqual('updateduser'); // Ensure member's login was updated
    });

    it('should return 404 if trying to update a non-existing member', async () => {
      const updateMemberDto = {
        arm_user_login: 'nonexistentuser',
        arm_user_email: 'nonexistentuser@example.com',
      };

      await request(app.getHttpServer())
        .put('/members/999')
        .send(updateMemberDto)
        .expect(404); // Expect a 404 status if the member does not exist
    });
  });

  describe('/members/:id (DELETE)', () => {
    it('should delete a member', async () => {
      const member = await memberRepository.save({
        arm_member_id: 4,
        arm_user_login: 'deleteuser',
        arm_user_email: 'deleteuser@example.com',
        arm_user_pass: 'password',
        arm_user_status: 1,
        arm_user_registered: new Date(),
        arm_user_url: '',
        arm_user_nicename: 'Delete User',
        arm_secondary_status: 1,
        arm_user_id: 1,
      });

      await request(app.getHttpServer())
        .delete(`/members/${member.arm_member_id}`)
        .expect(200);

      const deletedMember = await memberRepository.findOneBy({ arm_member_id: member.arm_member_id });
      expect(deletedMember).toBeNull(); // Ensure the member was deleted from the database
    });

    it('should return 404 if trying to delete a non-existing member', async () => {
      await request(app.getHttpServer())
        .delete('/members/999')
        .expect(404); // Expect a 404 status if the member does not exist
    });
  });
});
