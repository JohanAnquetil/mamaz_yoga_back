import { Member } from "@app/members/entities/member.entity";
import { PostNews } from "@app/posts/entities/post-news.entity";
import { PostsMeta } from "@app/posts_meta/entities/posts_meta.entity";
import { SubscriptionPlan } from "@app/subscription_plans/entities/subscription_plan.entity";
import { VideosUserTags } from "@app/users/entities/tags";
import { TagsPreferencesUser } from "@app/users/entities/tags_preferences.entity";
import { User } from "@app/users/entities/user.entity";
import { UsersMeta } from "@app/users_meta/entities/users_meta.entity";
import { VideoCategory } from "@app/videos/entities/categories.entity";
import { VideosFavorites } from "@app/videos/entities/favorites.entity";
import { VideosHistory } from "@app/videos/entities/historic.entity";
import { VideosTags } from "@app/videos/entities/tags.entity";
import { VideoDescription } from "@app/videos/entities/videos_description.entity";
import { VideosLiaisonsCategoriesVideos } from "@app/videos/entities/videos_liaisons_categories_videos.entity";
import { VideosModule } from "@app/videos/videos.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { env } from "process";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "test" ? "./.env.test" : "./.env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log("Using env file:", process.env.NODE_ENV === "test" ? "./.env.test" : "./.env");
        console.log("WHOAMI:", configService.get<string>("WHOAMI"));
        console.log("DB Host:", configService.get<string>("DB_HOST"));
        console.log("DB username:", configService.get<string>("DB_USERNAME"));
        console.log("DB password:", configService.get<string>("DB_PASSWORD"));
        console.log("DB Name:", configService.get<string>("DB_DATABASE_NAME"));
        console.log("DB Port:", configService.get<number>("DB_PORT"));
        console.log(
          "Running in environment:",
          configService.get<string>("NODE_ENV"),
        );
        return {
          type: "mysql",
          host: configService.get<string>("DB_HOST"),
          port: configService.get<number>("DB_PORT"),
          username: configService.get<string>("DB_USERNAME"),
          password: configService.get<string>("DB_PASSWORD"),
          database: configService.get<string>("DB_DATABASE_NAME"),
          entities: [
            Member,
            PostNews,
            PostsMeta,
            UsersMeta,
            User,
            SubscriptionPlan,
            VideoCategory,
            VideosHistory,
            VideosFavorites,
            VideoDescription,
            VideosTags,
            VideosLiaisonsCategoriesVideos,
            TagsPreferencesUser,
            VideosUserTags,   
          ],
          //synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DataBaseModule {}