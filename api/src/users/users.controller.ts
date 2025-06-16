import { JwtAuthGuard } from "@app/auth/guards/jwt.guards";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create_user.dto";
import { UpdateUserDto } from "./dto/update_user.dto";
import { UsersService } from "./users.service";
import { TagsPreferencesUser } from "./entities/tags_preferences.entity";
import { PreferencesUserDTO } from "./dto/preferences_user.dto";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get("tags-preferences")
  async getTagsPreferences() {
    const tagsPreferences = await this.usersService.getTagsPreferences();
    if (!tagsPreferences || tagsPreferences.length === 0) {
      throw new NotFoundException("No tags preferences found");
    }
    return tagsPreferences;
  }

  @Put("tags-preferences")
  async updateTagsPreferences(@Body() preferencesUser: PreferencesUserDTO) {
    console.log("Received preferencesUser:", preferencesUser);
    return this.usersService.updateTagsPreferences(preferencesUser);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOne(+id);
    try {
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }
      return user
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
