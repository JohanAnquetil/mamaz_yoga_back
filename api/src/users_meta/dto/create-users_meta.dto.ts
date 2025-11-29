import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUsersMetaDto {
  @IsOptional()
  @IsNumber()
  umetaId?: number

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
