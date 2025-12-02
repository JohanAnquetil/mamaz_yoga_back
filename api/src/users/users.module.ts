import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { SubscriptionPlansModule } from "@app/subscription_plans/subscription_plans.module";
import { TagsPreferencesUser } from "./entities/tags_preferences.entity";
import { VideosUserTags } from "./entities/tags";
import { UsersMeta } from "@app/users_meta/entities/users_meta.entity";
import { SubscriptionPlan } from "@app/subscription_plans/entities/subscription_plan.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, TagsPreferencesUser, VideosUserTags, UsersMeta, SubscriptionPlan]), SubscriptionPlansModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
