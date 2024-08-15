import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUsersMetaDto {
  @IsNumber()
  @IsNotEmpty()
  umetaId!: number;

  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @IsString()
  @IsOptional()
  metaKey?: string;

  @IsString()
  @IsOptional()
  metaValue?: string;
}
