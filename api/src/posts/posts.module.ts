import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostNews } from "./entities/post-news.entity";
import { PostsMeta } from "@app/posts_meta/entities/posts_meta.entity";
import { ElementorDataService } from "./utils/extract_elementor_data";
import { ExtractIllustrationImage } from "./utils/extract_illustration_image";

@Module({
  imports: [TypeOrmModule.forFeature([PostNews, PostsMeta])],
  controllers: [PostsController],
  providers: [PostsService, ElementorDataService, ExtractIllustrationImage],
})
export class PostsModule {}
