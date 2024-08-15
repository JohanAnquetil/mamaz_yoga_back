import { Module } from "@nestjs/common";
import { SubscriptionPlansService } from "./subscription_plans.service";
import { SubscriptionPlansController } from "./subscription_plans.controller";
import { SubscriptionPlan } from "./entities/subscription_plan.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan])],
  controllers: [SubscriptionPlansController],
  providers: [SubscriptionPlansService],
  exports: [SubscriptionPlansService],
})
export class SubscriptionPlansModule {}
