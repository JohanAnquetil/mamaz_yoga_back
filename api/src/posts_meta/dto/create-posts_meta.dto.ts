import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePostsMetaDto {
  @IsNumber()
  @IsNotEmpty()
  readonly meta_id!: number;
  @IsNumber()
  @IsNotEmpty()
  readonly postId!: number;
  @IsString()
  readonly metaKey?: string;
  @IsString()
  readonly metaValue?: string;
}
