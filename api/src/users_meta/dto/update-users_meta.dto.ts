import { PartialType } from "@nestjs/mapped-types";
import { CreateUsersMetaDto } from "./create-users_meta.dto";

export class UpdateUsersMetaDto extends PartialType(CreateUsersMetaDto) {}
