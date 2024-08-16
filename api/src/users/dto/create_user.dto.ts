import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id!: number;

  @IsNotEmpty()
  @IsString()
  readonly userLogin!: string;

  @IsNotEmpty()
  readonly userPass!: string;

  @IsNotEmpty()
  @IsString()
  readonly userNicename!: string;

  @IsNotEmpty()
  @IsString()
  readonly userEmail!: string;

  @IsString()
  readonly userUrl?: string;

  @IsNotEmpty()
  @IsDateString()
  readonly userRegistered?: Date;

  @IsString()
  readonly userActivationKey?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly userStatus!: number;

  @IsNotEmpty()
  @IsString()
  readonly displayName!: string;
}
