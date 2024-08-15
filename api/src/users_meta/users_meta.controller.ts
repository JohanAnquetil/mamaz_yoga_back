import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from "@nestjs/common";
import { UsersMetaService } from "./users_meta.service";
import { CreateUsersMetaDto } from "./dto/create-users_meta.dto";
import { UpdateUsersMetaDto } from "./dto/update-users_meta.dto";

@Controller("users-meta")
export class UsersMetaController {
  constructor(private readonly usersMetaService: UsersMetaService) {}

  @Post()
  create(@Body() createUsersMetaDto: CreateUsersMetaDto) {
    return this.usersMetaService.create(createUsersMetaDto);
  }

  @Get()
  findAll() {
    return this.usersMetaService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    try {
      return this.usersMetaService.findOne(+id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUsersMetaDto: UpdateUsersMetaDto,
  ) {
    return this.usersMetaService.update(+id, updateUsersMetaDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<string> {
    await this.usersMetaService.remove(+id);
    return "User Metas a été effacé";
  }
}