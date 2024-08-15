import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostNews } from '../entities/post-news.entity';

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findPublished: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  describe('create', () => {
    it('should call the postsService create method with the correct arguments', async () => {
      const createPostDto: CreatePostDto = {
        id: 1,
        postAuthor: 1,
        postDate: new Date(),
        postDateGmt: new Date(),
        postTitle: 'Test Post',
        postStatus: 'published',
        commentStatus: 'open',
        pingStatus: 'open',
        postModifiedGmt: new Date(),
        postParent: 0,
        menuOrder: 0,
        postType: 'post',
        commentCount: 0,
      };
      await postsController.create(createPostDto);
      expect(postsService.create).toHaveBeenCalledWith(createPostDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result: PostNews[] = [{
        id: 1,
        postAuthor: 1,
        postDate: new Date(),
        postDateGmt: new Date(),
        postTitle: 'Test Post',
        postStatus: 'published',
        commentStatus: 'open',
        pingStatus: 'open',
        postModifiedGmt: new Date(),
        postParent: 0,
        menuOrder: 0,
        postType: 'post',
        commentCount: 0,
        postsMeta: [], // Including postsMeta to satisfy the PostNews entity type
      }];
      jest.spyOn(postsService, 'findAll').mockResolvedValue(result);

      expect(await postsController.findAll()).toBe(result);
    });
  });

  describe('findPublished', () => {
    it('should return an array of published posts', async () => {
      const result = { message: 'Les posts publiés sont bien reçus', posts: [] };
      jest.spyOn(postsService, 'findPublished').mockResolvedValue(result);

      expect(await postsController.findPublished()).toBe(result);
    });

    it('should throw an exception if no published posts are found', async () => {
      jest.spyOn(postsService, 'findPublished').mockResolvedValue(undefined);

      await expect(postsController.findPublished()).rejects.toThrow('Aucun post disponible');
    });
  });

  describe('findOne', () => {
    it('should return a single post by ID', async () => {
      const result = { message: 'le post a été trouvé', data: { id: 1, title: 'Test Post' } };
      jest.spyOn(postsService, 'findOne').mockResolvedValue(result);

      expect(await postsController.findOne('1')).toBe(result);
    });

    it('should throw an exception if the post is not found', async () => {
      jest.spyOn(postsService, 'findOne').mockRejectedValue(new Error('Post not found'));

      await expect(postsController.findOne('1')).rejects.toThrow('Post not found');
    });
  });

  describe('update', () => {
    it('should update a post and return the number of affected rows', async () => {
      const result = 1;
      const updatePostDto: UpdatePostDto = {
        id: 1,
        postAuthor: 1,
        postDate: new Date(),
        postDateGmt: new Date(),
        postTitle: 'Test Post',
        postStatus: 'published',
        commentStatus: 'open',
        pingStatus: 'open',
        postModifiedGmt: new Date(),
        postParent: 0,
        menuOrder: 0,
        postType: 'post',
        commentCount: 0,
      };
      jest.spyOn(postsService, 'update').mockResolvedValue(result);

      expect(await postsController.update('1', updatePostDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete a post and return a confirmation message', async () => {
      jest.spyOn(postsService, 'remove').mockResolvedValue('Post effacé');

      expect(await postsController.remove('1')).toBe('Post effacé');
    });
  });
});
