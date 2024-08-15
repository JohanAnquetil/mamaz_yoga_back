import { PartialType } from "@nestjs/mapped-types";
import { CreateMemberDto } from "./create-member.dto";
import { IsString, IsInt, IsOptional } from "class-validator";

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsInt()
  readonly age?: number;
}
