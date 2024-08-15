import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSubscriptionPlanDto {
  @IsNumber()
  @IsNotEmpty()
  armSubscriptionPlanId!: number;

  @IsString()
  @IsNotEmpty()
  armSubscriptionPlanName!: string;

  @IsString()
  armSubscriptionPlanDescription?: string;

  @IsString()
  @IsNotEmpty()
  armSubscriptionPlanType!: string;

  @IsString()
  armSubscriptionPlanOptions?: string;

  @IsNumber()
  @IsNotEmpty()
  armSubscriptionPlanAmount!: number;

  @IsNumber()
  @IsNotEmpty()
  armSubscriptionPlanStatus!: number;

  @IsString()
  armSubscriptionPlanRole?: string;

  @IsNumber()
  @IsNotEmpty()
  armSubscriptionPlanPostId!: number;

  @IsNumber()
  @IsNotEmpty()
  armSubscriptionPlanGiftStatus!: number;

  @IsNumber()
  @IsNotEmpty()
  armSubscriptionPlanIsDelete!: number;

  @IsNotEmpty()
  @IsDate()
  armSubscriptionPlanCreatedDate!: Date;
}
