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
import { PostNews } from "./entities/post-news.entity";

// This decorator defines the base route for this controller as '/posts'.
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Handles POST requests to create a new post.
  // @param createPostDto - Data Transfer Object containing the information needed to create a new post.
  // @returns A promise that resolves to void once the post is created.
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() createPostDto: CreatePostDto): Promise<void> {
      return this.postsService.create(createPostDto);
    }

  /// Gets all posts
  @Get()
  findAll(): Promise<PostNews[]> {
    return this.postsService.findAll();
  }

  // Get only published posts
  @Get("published")
  async findPublished(): Promise<{"message": string, "posts": {}}> {
    const publishedPost = await this.postsService.findPublished();
    if (!publishedPost) {
      throw new HttpException("Aucun post disponible", 404);
    }
    return publishedPost;
  }

  // Get only one post by id
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<{ message: string; data: {} } | undefined> {
    try {
      const onePost = await this.postsService.findOne(+id);
      return onePost;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }
  // Handles PATCH requests to update a post by its ID.
  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto): Promise<number> {
    return this.postsService.update(+id, updatePostDto);
  }
  // Delete a post thanks to its id
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<string> {
    await this.postsService.remove(+id);
    return "Post effacé";
  }
}
