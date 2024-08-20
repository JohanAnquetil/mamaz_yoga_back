import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from '../videos.controller';
import { VideosService } from '../videos.service';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guards';

describe('VideosController', () => {
  let controller: VideosController;
  let service: VideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosController],
      providers: [
        {
          provide: VideosService,
          useValue: {
            getCategories: jest.fn(),
            getVideosInCategory: jest.fn(),
            deleteCategory: jest.fn(),
            renameCategory: jest.fn(),
            renameVideo: jest.fn(),
            deleteVideo: jest.fn(),
            downloadVideo: jest.fn(),
            searchVideos: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VideosController>(VideosController);
    service = module.get<VideosService>(VideosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getCategories from the service', () => {
    controller.getCategories();
    expect(service.getCategories).toHaveBeenCalled();
  });

  it('should call getVideosInCategory with correct parameters', () => {
    controller.getVideosInCategory('category', 1, 10);
    expect(service.getVideosInCategory).toHaveBeenCalledWith('category', 1, 10);
  });

  it('should call deleteCategory with correct parameters', () => {
    controller.deleteCategory('category');
    expect(service.deleteCategory).toHaveBeenCalledWith('category');
  });

  it('should call renameCategory with correct parameters', () => {
    controller.renameCategory('category', 'newName');
    expect(service.renameCategory).toHaveBeenCalledWith('category', 'newName');
  });

  it('should call renameVideo with correct parameters', () => {
    controller.renameVideo('category', 'video', 'newName');
    expect(service.renameVideo).toHaveBeenCalledWith('category', 'video', 'newName');
  });

  it('should call deleteVideo with correct parameters', () => {
    controller.deleteVideo('category', 'video');
    expect(service.deleteVideo).toHaveBeenCalledWith('category', 'video');
  });

  it('should call searchVideos with correct parameters', () => {
    controller.search('query');
    expect(service.searchVideos).toHaveBeenCalledWith('query');
  });
});
