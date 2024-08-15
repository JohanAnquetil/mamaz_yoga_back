import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { UpdatePostDto } from "./dto/update-post.dto";
import { CreatePostDto } from "./dto/create-post.dto";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get("published")
  async findPublished() {
    const publishedPost = await this.postsService.findPublished();
    if (!publishedPost) {
      throw new HttpException("Aucun post disponible", 404);
    }
    return publishedPost;
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const onePost = await this.postsService.findOne(+id);
      return onePost;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<string> {
    await this.postsService.remove(+id);
    return "Post effacé";
  }
}
