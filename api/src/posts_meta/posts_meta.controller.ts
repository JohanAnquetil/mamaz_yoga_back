import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  NotFoundException,
} from "@nestjs/common";
import { PostsMetaService } from "./posts_meta.service";
import { CreatePostsMetaDto } from "./dto/create-posts_meta.dto";
import { UpdatePostsMetaDto } from "./dto/update-posts_meta.dto";
import { PostsMeta } from "./entities/posts_meta.entity";

@Controller("posts-meta")
export class PostsMetaController {
  constructor(private readonly postsMetaService: PostsMetaService) {}

  @Post()
  create(@Body() createPostsMetaDto: CreatePostsMetaDto): Promise<void> {
    return this.postsMetaService.create(createPostsMetaDto);
  }

  @Get()
  findAll(): Promise<PostsMeta[]> {
    return this.postsMetaService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<PostsMeta |null | undefined> {
    try {
      const onePostMeta = await this.postsMetaService.findOne(+id)
      if (!onePostMeta) {
        throw new NotFoundException(`Le post avec l'id: ${id} n'existe pas`);
    }
      return onePostMeta;
    } catch (error) {
      
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePostsMetaDto: UpdatePostsMetaDto,
  ): Promise<number | undefined> {
    return this.postsMetaService.update(+id, updatePostsMetaDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    return this.postsMetaService.remove(+id);
  }
}
