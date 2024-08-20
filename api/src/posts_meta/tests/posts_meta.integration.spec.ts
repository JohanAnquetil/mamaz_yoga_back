import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtAuthGuard } from "@app/auth/guards/jwt.guards";
import { PostsMeta } from "../entities/posts_meta.entity";
import { CreatePostsMetaDto } from "../dto/create-posts_meta.dto";

describe("PostsMetaModule (integration)", () => {
  let app: INestApplication;
  let postMetaRepository: Repository<PostsMeta>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideGuard(JwtAuthGuard) // Override the AuthGuard to disable it
    .useValue({ canActivate: () => true }) // Allow all requests to pass through
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    postMetaRepository = moduleFixture.get<Repository<PostsMeta>>(getRepositoryToken(PostsMeta));
  }, 10000);

  it("/users (POST) - success", async () => {
    const createPostMetaDto: CreatePostsMetaDto = {
      meta_id: 1,
      postId: 1,
      metaKey: 'test',
      metaValue: 'test'
    };

    const response = await request(app.getHttpServer())
      .post("/posts-meta")
      .send(createPostMetaDto);

    expect(response.status).toBe(201);

    const postMeta = await postMetaRepository.findOne({ where: { meta_id: createPostMetaDto.meta_id } });
    expect(postMeta).toBeDefined();
    expect(postMeta?.meta_id).toBe(createPostMetaDto.meta_id);
  });

  it("/users/:id (GET) - should return a post umeta_id", async () => {
    const createPostMetaDto: Partial<CreatePostsMetaDto> = {
        meta_id: 1,
    };

    await postMetaRepository.save(createPostMetaDto);


    const response = await request(app.getHttpServer())
      .get(`/posts-meta/${createPostMetaDto.meta_id}`)
      .expect(200);

    console.log(JSON.stringify(response.body.meta_id))
    console.log(`createPostMetaDto.meta_id: ${createPostMetaDto.meta_id}`)
    expect(response.body.meta_id).toBe(createPostMetaDto.meta_id);
  });

  it("/users/:id (PATCH) - should update a post meta", async () => {
    const createPostMetaDto: CreatePostsMetaDto = {
        meta_id: 1,
        postId: 1,
        metaKey: 'test',
        metaValue: 'test'
    };

    await postMetaRepository.save(createPostMetaDto);

    const updatePostMetaDto: Partial<CreatePostsMetaDto> = {
      meta_id: 1,
      metaKey: "Updated meta kay",
      metaValue: "Updated meta value",
    };

    await request(app.getHttpServer())
      .patch(`/posts-meta/${updatePostMetaDto.meta_id}`)
      .send(updatePostMetaDto)
      .expect(200);

    const updatedPostMeta = await postMetaRepository.findOne({ where: { meta_id: updatePostMetaDto.meta_id} });
    expect(updatedPostMeta?.metaKey).toBe(updatePostMetaDto.metaKey);
    expect(updatedPostMeta?.metaValue).toBe(updatePostMetaDto.metaValue);
  });

  it("/users/:id (DELETE) - should delete a post meta", async () => {
    const createPostMetaDto: CreatePostsMetaDto = {
      meta_id: 1,
      postId: 1,
      metaKey: 'test',
      metaValue: 'test'
  };

    await postMetaRepository.save(createPostMetaDto);

    await request(app.getHttpServer())
      .delete(`/posts-meta/${createPostMetaDto.meta_id}`)
      .expect(200);

    const postMeta = await postMetaRepository.findOne({ where: { meta_id: createPostMetaDto.meta_id } });
    expect(postMeta).toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
