import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
} from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id!: number;

  @IsNotEmpty()
  @IsNumber()
  readonly postAuthor!: number;

  @IsNotEmpty()
  @IsDate()
  readonly postDate!: Date;

  @IsDate()
  readonly postDateGmt!: Date;

  @IsString()
  readonly postContent?: string;

  @IsNotEmpty()
  @IsString()
  readonly postTitle!: string;

  @IsString()
  readonly postExcerpt?: string;

  @IsNotEmpty()
  @IsString()
  readonly postStatus!: string;

  @IsNotEmpty()
  @IsString()
  readonly commentStatus!: string;

  @IsNotEmpty()
  @IsString()
  readonly pingStatus!: string;

  @IsString()
  readonly postPassword?: string;

  @IsNotEmpty()
  @IsString()
  readonly postName?: string;

  @IsString()
  readonly toPing?: string;

  @IsString()
  readonly pinged?: string;

  @IsNotEmpty()
  @IsDate()
  readonly postModified?: Date;

  @IsNotEmpty()
  readonly postModifiedGmt!: Date;

  @IsString()
  readonly postContentFiltered?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly postParent!: number;

  @IsNotEmpty()
  @IsString()
  readonly guid?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly menuOrder!: number;

  @IsNotEmpty()
  @IsString()
  readonly postType!: string;

  @IsString()
  readonly postMimeType?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly commentCount!: number;
}
