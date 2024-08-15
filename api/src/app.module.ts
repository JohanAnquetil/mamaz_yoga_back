import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MembersModule } from "./members/members.module";
import { PostsModule } from "./posts/posts.module";
import { DataBaseModule } from "./database/database.module";
import { PostsMetaModule } from "./posts_meta/posts_meta.module";
import { UsersModule } from "./users/users.module";
import { UsersMetaModule } from "./users_meta/users_meta.module";
import { SubscriptionPlansModule } from "./subscription_plans/subscription_plans.module";
import { AuthModule } from "./auth/auth.module";
import { VideosModule } from './videos/videos.module';
import { VideosService } from './videos/videos.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DataBaseModule,
    MembersModule,
    PostsModule,
    PostsMetaModule,
    UsersModule,
    UsersMetaModule,
    SubscriptionPlansModule,
    AuthModule,
    VideosModule,
  ],

  providers: [VideosService],
  controllers: [],
})
export class AppModule {}
