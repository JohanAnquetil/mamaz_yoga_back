import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from "@nestjs/common";
import { PostsMetaService } from "./posts_meta.service";
import { CreatePostsMetaDto } from "./dto/create-posts_meta.dto";
import { UpdatePostsMetaDto } from "./dto/update-posts_meta.dto";

@Controller("posts-meta")
export class PostsMetaController {
  constructor(private readonly postsMetaService: PostsMetaService) {}

  @Post()
  create(@Body() createPostsMetaDto: CreatePostsMetaDto) {
    return this.postsMetaService.create(createPostsMetaDto);
  }

  @Get()
  findAll() {
    return this.postsMetaService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    try {
      return this.postsMetaService.findOne(+id);
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
  ) {
    return this.postsMetaService.update(+id, updatePostsMetaDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.postsMetaService.remove(+id);
  }
}
