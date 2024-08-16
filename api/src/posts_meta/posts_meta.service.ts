import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreatePostsMetaDto } from "./dto/create-posts_meta.dto";
import { UpdatePostsMetaDto } from "./dto/update-posts_meta.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PostsMeta } from "./entities/posts_meta.entity";
import { EntityManager, Repository, UpdateResult } from "typeorm";

@Injectable()
export class PostsMetaService {
  constructor(
    @InjectRepository(PostsMeta)
    private postsMetaRepository: Repository<PostsMeta>,
    //private readonly entityManager: EntityManager,
  ) {}
   
  // Creates a new PostsMeta entry in the database.
  async create(createPostsMetaDto: CreatePostsMetaDto) {
    const postsMeta = new PostsMeta(createPostsMetaDto);
    await this.postsMetaRepository.save(postsMeta);
  }
  // Retrieves all PostsMeta entries from the database.
  async findAll() {
    return this.postsMetaRepository.find();
  }
// Retrieves all PostsMeta entries from the database thanks to its ID
  async findOne(id: number): Promise<PostsMeta | null> {
    try {
      const onePostMeta = await this.postsMetaRepository.findOne({
        where: { meta_id: id },
      });
      if (!onePostMeta) {
        throw new NotFoundException(`Post meta with ID ${id} not found`);
      }
      return onePostMeta;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Erreur lors de la récupération du post meta",
      );
    }
  }
  // Updates the PostsMeta thanks to its Id
  async update(id: number, updatePostsMetaDto: UpdatePostsMetaDto) {
    const update: UpdateResult = await this.postsMetaRepository.update(
      id,
      updatePostsMetaDto,
    );
    return update.affected;
  }
  // Retrieves all PostsMeta entries from the database.
  async remove(id: number): Promise<void> {
    await this.postsMetaRepository.delete(id);
  }
}
