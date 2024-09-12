import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { PostNews } from '../entities/post-news.entity';
import { Repository, EntityManager, UpdateResult, DeleteResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { ElementorDataService } from '../utils/extract_elementor_data';
import { ExtractIllustrationImage } from '../utils/extract_illustration_image';
import { PostFormatted } from '../dto/post_formatted.dto';

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: Repository<PostNews>;
  let entityManager: EntityManager;
  let elementorDataService: ElementorDataService;
  let extractIllustrationImage: ExtractIllustrationImage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostNews),
          useClass: Repository,
        },
        {
          provide: EntityManager,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: ElementorDataService,
          useValue: {
            extractAllContent: jest.fn(),
          },
        },
        {
          provide: ExtractIllustrationImage,
          useValue: {
            extractFirstImageUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<Repository<PostNews>>(getRepositoryToken(PostNews));
    entityManager = module.get<EntityManager>(EntityManager);
    elementorDataService = module.get<ElementorDataService>(ElementorDataService);
    extractIllustrationImage = module.get<ExtractIllustrationImage>(ExtractIllustrationImage);
  });

  describe('create', () => {
    it('should save a new post using the entity manager', async () => {
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

      await postsService.create(createPostDto);
      expect(entityManager.save).toHaveBeenCalledWith(expect.any(PostNews));
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result: PostNews[] = [
        {
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
          postsMeta: [],
        },
      ];

      jest.spyOn(postsRepository, 'find').mockResolvedValue(result);

      expect(await postsService.findAll()).toBe(result);
    });
  });

  describe('findPublished', () => {
    it('should return formatted published posts', async () => {
      const posts = [
        {
          id: 1,
          postTitle: 'Test Post',
          postDate: new Date(),
          postModified: new Date(),
          postsMeta: [{ metaKey: '_elementor_data', metaValue: 'elementor_data_value' }],
        },
      ];

      jest.spyOn(postsRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(posts),
      } as any);

      jest.spyOn(elementorDataService, 'extractAllContent').mockReturnValue(['extracted_content'] as PostFormatted[]);
      jest.spyOn(extractIllustrationImage, 'extractFirstImageUrl').mockReturnValue('image_url');

      const result = await postsService.findPublished();

      expect(result).toEqual({
        message: 'Les posts publiés sont bien reçus',
        posts: [
          {
            id: 1,
            post_title: 'Test Post',
            post_date_creation: posts[0].postDate,
            post_date_modified: posts[0].postModified,
            post_illustration_image: 'image_url',
            post_detailed: ['extracted_content'],
          },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a post by ID', async () => {
      const post = {
        id: 1,
        postTitle: 'Test Post',
        postDate: new Date(),
        postModified: new Date(),
        postAuthor: 1,
        postStatus: 'published',
        commentStatus: 'open',
        postName: 'test-post',
        postType: 'post',
        guid: 'http://example.com/test-post',
        postsMeta: [{ metaKey: '_elementor_data', metaValue: 'elementor_data_value' }],
      };

      jest.spyOn(postsRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(post),
      } as any);

      jest.spyOn(elementorDataService, 'extractAllContent').mockReturnValue(['extracted_content']as PostFormatted[]);
      jest.spyOn(extractIllustrationImage, 'extractFirstImageUrl').mockReturnValue('image_url');

      const result = await postsService.findOne(1);

      expect(result).toEqual({
        message: 'le post a été trouvé',
        data: {
          id: post.id,
          title: post.postTitle,
          illustration_image: 'image_url',
          date_creation: post.postDate,
          date_modified: post.postModified,
          post_content: ['extracted_content'],
          post_author: post.postAuthor,
          post_status: post.postStatus,
          comment_status: post.commentStatus,
          post_name: post.postName,
          post_type: post.postType,
          guid: post.guid,
        },
      });
    });

    it('should throw NotFoundException if post is not found', async () => {
      jest.spyOn(postsRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      } as any);

      await expect(postsService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post and return the number of affected rows', async () => {
      const updateResult: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      };
      const updatePostDto: UpdatePostDto = {
        id: 1,
        postAuthor: 1,
        postDate: new Date(),
        postDateGmt: new Date(),
        postTitle: 'Updated Post',
        postStatus: 'published',
        commentStatus: 'open',
        pingStatus: 'open',
        postModifiedGmt: new Date(),
        postParent: 0,
        menuOrder: 0,
        postType: 'post',
        commentCount: 0,
      };

      jest.spyOn(postsRepository, 'update').mockResolvedValue(updateResult);

      expect(await postsService.update(1, updatePostDto)).toBe(updateResult.affected);
    });
  });

  describe('remove', () => {
    it('should delete a post and return a confirmation message', async () => {
      const deleteResult: DeleteResult = {
        affected: 1,
        raw: {},
      };

      jest.spyOn(postsRepository, 'delete').mockResolvedValue(deleteResult);

      expect(await postsService.remove(1)).toBe('Le post a bien été effacé');
    });
  });
});
