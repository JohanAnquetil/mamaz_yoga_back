import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  ParseIntPipe,
  HttpException,
  UseGuards,
} from "@nestjs/common";
import { MembersService } from "./members.service";
import { Member } from "./entities/member.entity";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { JwtAuthGuard } from "@app/auth/guards/jwt.guards";

@Controller("members")
@UseGuards(JwtAuthGuard)
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get()
  async findAll(): Promise<{ message: string; data: Member[] } | string> {
    return this.membersService.findAll();
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<{ message: string; data: Member } | undefined> {
    try {
      const member = await this.membersService.findOne(id);
      return member;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  @Post()
  async create(@Body() member: Member) {
    return this.membersService.create(member);
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    const affected = await this.membersService.update(id, updateMemberDto);
    if (affected === 0) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<string> {
    await this.membersService.delete(id);
    return "Membre effacé !";
  }
}
