import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideosController } from "./videos.controller";
import { VideosService } from "./videos.service";
import { VideoCategory } from "./entities/categories.entity";
import { User } from "@app/users/entities/user.entity";
import { VideosHistory } from "./entities/historic.entity";
import { VideoDescription } from "./entities/videos_description.entity";
import { VideosFavorites } from "./entities/favorites.entity";
import { VideosLiaisonsCategoriesVideos } from "./entities/videos_liaisons_categories_videos.entity";
import { VideosTags } from "./entities/tags.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoDescription,
      VideosHistory,
      VideoCategory,
      VideosFavorites,
      VideosLiaisonsCategoriesVideos,
      VideosTags,
      User,
    ]),
  ],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
