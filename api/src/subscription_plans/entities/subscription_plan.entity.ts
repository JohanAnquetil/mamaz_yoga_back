import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "mod350_arm_subscription_plans" })
export class SubscriptionPlan {
  @PrimaryGeneratedColumn("increment", { name: "arm_subscription_plan_id" })
  armSubscriptionPlanId!: number;

  @Column("varchar", {
    length: 255,
    name: "arm_subscription_plan_name",
    nullable: false,
  })
  armSubscriptionPlanName!: string;

  @Column("text", {
    name: "arm_subscription_plan_description",
    default: null,
    nullable: true,
  })
  armSubscriptionPlanDescription?: string;

  @Column("varchar", {
    length: 50,
    name: "arm_subscription_plan_type",
    nullable: false,
  })
  armSubscriptionPlanType!: string;

  @Column("longtext", {
    name: "arm_subscription_plan_options",
    nullable: true,
    default: null,
  })
  armSubscriptionPlanOptions?: string;

  @Column("double", { name: "arm_subscription_plan_amount", nullable: false })
  armSubscriptionPlanAmount!: number;

  @Column("int", { name: "arm_subscription_plan_status", nullable: false })
  armSubscriptionPlanStatus!: number;

  @Column("varchar", {
    length: 100,
    name: "arm_subscription_plan_role",
    nullable: true,
    default: null,
  })
  armSubscriptionPlanRole?: string;

  @Column("bigint", { name: "arm_subscription_plan_post_id", nullable: false })
  armSubscriptionPlanPostId!: number;

  @Column("int", { name: "arm_subscription_plan_gift_status", nullable: false })
  armSubscriptionPlanGiftStatus!: number;

  @Column("int", { name: "arm_subscription_plan_is_delete", nullable: false })
  armSubscriptionPlanIsDelete!: number;

  @Column("timestamp", {
    name: "arm_subscription_plan_created_date",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  armSubscriptionPlanCreatedDate!: Date;
}
