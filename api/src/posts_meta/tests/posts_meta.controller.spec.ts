import { Test, TestingModule } from '@nestjs/testing';
import { PostsMetaController } from '../posts_meta.controller';
import { PostsMetaService } from '../posts_meta.service';
import { CreatePostsMetaDto } from '../dto/create-posts_meta.dto';
import { UpdatePostsMetaDto } from '../dto/update-posts_meta.dto';
import { PostsMeta } from '../entities/posts_meta.entity';
import { NotFoundException, HttpException } from '@nestjs/common';

describe('PostsMetaController', () => {
  let controller: PostsMetaController;
  let service: PostsMetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsMetaController],
      providers: [
        {
          provide: PostsMetaService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsMetaController>(PostsMetaController);
    service = module.get<PostsMetaService>(PostsMetaService);
  });

  describe('create', () => {
    it('should call the service to create a new post meta', async () => {
      const createPostsMetaDto: CreatePostsMetaDto = { meta_id: 1, postId: 1, metaKey: 'test', metaValue: 'value' };
      await controller.create(createPostsMetaDto);
      expect(service.create).toHaveBeenCalledWith(createPostsMetaDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of post meta entries', async () => {
      const mockPostsMeta = [{ meta_id: 1, postId: 1, metaKey: 'test', metaValue: 'value' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockPostsMeta as PostsMeta[]);

      const result = await controller.findAll();
      expect(result).toEqual(mockPostsMeta);
    });
  });

  describe('findOne', () => {
    it('should return a single post meta by ID', async () => {
      const mockPostMeta = { meta_id: 1, postId: 1, metaKey: 'test', metaValue: 'value' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPostMeta as PostsMeta);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockPostMeta);
    });

    it('should throw a NotFoundException if the post meta is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should rethrow HttpException if one is thrown by the service', async () => {
      const httpException = new HttpException('Error occurred', 500);
      jest.spyOn(service, 'findOne').mockImplementation(() => {
        throw httpException;
      });

      await expect(controller.findOne('1')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should call the service to update a post meta', async () => {
      const updatePostsMetaDto: UpdatePostsMetaDto = { metaKey: 'updated', metaValue: 'updated value' };
      jest.spyOn(service, 'update').mockResolvedValue(1);

      const result = await controller.update('1', updatePostsMetaDto);
      expect(service.update).toHaveBeenCalledWith(1, updatePostsMetaDto);
      expect(result).toBe(1);
    });
  });

  describe('remove', () => {
    it('should call the service to remove a post meta', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
