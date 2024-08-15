import { Module } from "@nestjs/common";
import { PostsMetaService } from "./posts_meta.service";
import { PostsMetaController } from "./posts_meta.controller";
import { PostsMeta } from "./entities/posts_meta.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostNews } from "@app/posts/entities/post-news.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PostsMeta, PostNews])],
  controllers: [PostsMetaController],
  providers: [PostsMetaService],
})
export class PostsMetaModule {}
