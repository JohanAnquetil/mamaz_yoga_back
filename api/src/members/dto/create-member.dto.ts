import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateMemberDto {
  @IsNotEmpty()
  @IsNumber()
  readonly arm_member_id!: number;

  @IsNotEmpty()
  @IsNumber()
  readonly arm_user_id?: number;

  @IsNotEmpty()
  @IsString()
  readonly arm_user_login?: string;

  @IsNotEmpty()
  @IsString()
  readonly arm_user_pass?: string;

  @IsNotEmpty()
  @IsString()
  readonly arm_user_nicename?: string;

  @IsNotEmpty()
  @IsString()
  readonly arm_user_email?: string;

  @IsNotEmpty()
  @IsString()
  readonly arm_user_url?: string;

  @IsNotEmpty()
  @IsDateString()
  readonly arm_user_registered?: Date;

  @IsNotEmpty()
  @IsNumber()
  readonly arm_user_status?: number;

  @IsNotEmpty()
  @IsNumber()
  readonly arm_secondary_status?: number;

  @IsOptional()
  @IsString()
  readonly arm_user_plan_ids?: string;

  @IsOptional()
  @IsString()
  readonly arm_user_suspended_plan_ids?: string;
}
