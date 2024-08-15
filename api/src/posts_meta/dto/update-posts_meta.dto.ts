import { PartialType } from "@nestjs/mapped-types";
import { CreatePostsMetaDto } from "./create-posts_meta.dto";

export class UpdatePostsMetaDto extends PartialType(CreatePostsMetaDto) {}
