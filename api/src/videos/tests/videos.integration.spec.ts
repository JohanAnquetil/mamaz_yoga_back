import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { JwtAuthGuard } from "@app/auth/guards/jwt.guards";
import * as fs from 'fs';
import { VideosService } from "../videos.service";
import { PassThrough } from 'stream';

describe("VideosModule (integration)", () => {
  let app: INestApplication;
  let videosService: VideosService;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideGuard(JwtAuthGuard) // Override the AuthGuard to disable it
    .useValue({ canActivate: () => true }) // Allow all requests to pass through
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    videosService = moduleFixture.get<VideosService>(VideosService);

  }, 10000);

  afterAll(async () => {
    await app.close();
  });

    it('/videos/categories (GET)', () => {
    jest.spyOn(videosService, 'getCategories').mockResolvedValue([{ name: 'category1', videoCount: 2 }]);

    return request(app.getHttpServer())
      .get('/videos/categories')
      .expect(200)
      .expect([{ name: 'category1', videoCount: 2 }]);
  });


    it('/videos/categories/:category (GET)', () => {
    jest.spyOn(videosService, 'getVideosInCategory').mockResolvedValue({
      videos: [{ name: 'video1.mp4', category: 'category', formattedDuration: '1:00' }],
      total: 1,
    });

    return request(app.getHttpServer())
      .get('/videos/categories/category')
      .expect(200)
      .expect({
        videos: [{ name: 'video1.mp4', category: 'category', formattedDuration: '1:00' }],
        total: 1,
      });
  });

  it('/videos/categories/:category (DELETE)', () => {
    jest.spyOn(videosService, 'deleteCategory').mockResolvedValue('La catégorie category a été effacée');

    return request(app.getHttpServer())
      .delete('/videos/categories/category')
      .expect(200)
      .expect('La catégorie category a été effacée');
  });


  it('/videos/categories/:category/:video (DELETE)', () => {
    jest.spyOn(videosService, 'deleteVideo').mockResolvedValue('La vidéo video.mp4 a été effacée');

    return request(app.getHttpServer())
      .delete('/videos/categories/category/video.mp4')
      .expect(200)
      .expect('La vidéo video.mp4 a été effacée');
  });

  it('/videos/categories/:category/:video (PUT)', () => {
    jest.spyOn(videosService, 'renameVideo').mockResolvedValue('La vidéo video.mp4 a été renommée en newName.mp4');

    return request(app.getHttpServer())
      .put('/videos/categories/category/video.mp4')
      .send({ newName: 'newName.mp4' })
      .expect(200)
      .expect('La vidéo video.mp4 a été renommée en newName.mp4');
  });

  it('/videos/search (GET)', () => {
    jest.spyOn(videosService, 'searchVideos').mockResolvedValue([
      { category: 'category', name: 'video1.mp4' },
      { category: 'category', name: 'video2.mkv' },
    ]);

    return request(app.getHttpServer())
      .get('/videos/search?query=video')
      .expect(200)
      .expect([
        { category: 'category', name: 'video1.mp4' },
        { category: 'category', name: 'video2.mkv' },
      ]);
  });


});
