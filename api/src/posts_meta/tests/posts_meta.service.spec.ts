import { Test, TestingModule } from '@nestjs/testing';
import { PostsMetaService } from '../posts_meta.service';
import { Repository, UpdateResult } from 'typeorm';
import { PostsMeta } from '../entities/posts_meta.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreatePostsMetaDto } from '../dto/create-posts_meta.dto';
import { UpdatePostsMetaDto } from '../dto/update-posts_meta.dto';

describe('PostsMetaService', () => {
  let service: PostsMetaService;
  let repository: Repository<PostsMeta>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsMetaService,
        {
          provide: getRepositoryToken(PostsMeta),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostsMetaService>(PostsMetaService);
    repository = module.get<Repository<PostsMeta>>(getRepositoryToken(PostsMeta));
  });

  describe('create', () => {
    it('should create a new PostsMeta entry', async () => {
      const createPostsMetaDto: CreatePostsMetaDto = {
        meta_id: 1,
        postId: 1,
        metaKey: 'test-key',
        metaValue: 'test-value',
      };

      jest.spyOn(repository, 'save').mockResolvedValue({} as PostsMeta);

      await service.create(createPostsMetaDto);

      expect(repository.save).toHaveBeenCalledWith(expect.any(PostsMeta));
    });
  });

  describe('findOne', () => {
    it('should return a single PostsMeta entry by ID', async () => {
      const mockPostMeta = {} as PostsMeta;
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPostMeta);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPostMeta);
    });

    it('should throw a NotFoundException if no PostsMeta entry is found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    describe('findAll', () => {
        it('should return an array of PostsMeta entries', async () => {
          const mockPostsMeta = [
            { meta_id: 1, postId: 1, metaKey: 'test1', metaValue: 'value1' },
            { meta_id: 2, postId: 2, metaKey: 'test2', metaValue: 'value2' },
          ] as PostsMeta[];
          
          jest.spyOn(repository, 'find').mockResolvedValue(mockPostsMeta);
      
          const result = await service.findAll();
      
          expect(result).toEqual(mockPostsMeta);
        });
      });
      describe('update', () => {
        it('should update a PostsMeta entry and return the number of affected rows', async () => {
          const updatePostsMetaDto: UpdatePostsMetaDto = {
            meta_id: 1,
            postId: 1,
            metaKey: 'updated-key',
            metaValue: 'updated-value',
          };
      
          const mockUpdateResult = { affected: 1 } as UpdateResult;
          jest.spyOn(repository, 'update').mockResolvedValue(mockUpdateResult);
      
          const result = await service.update(1, updatePostsMetaDto);
      
          expect(result).toBe(1);
        });
      
        it('should return 0 if no rows were affected', async () => {
          const updatePostsMetaDto: UpdatePostsMetaDto = {
            meta_id: 1,
            postId: 1,
            metaKey: 'updated-key',
            metaValue: 'updated-value',
          };
      
          const mockUpdateResult = { affected: 0 } as UpdateResult;
          jest.spyOn(repository, 'update').mockResolvedValue(mockUpdateResult);
      
          const result = await service.update(1, updatePostsMetaDto);
      
          expect(result).toBe(0);
        });
      });
            

  });
});
