import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  EntityManager,
  Repository,
  UpdateResult,
} from "typeorm";
import { Member } from "./entities/member.entity";
//import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private readonly entityManager: EntityManager,
  ) {}

  // Create a new member
  async create(createMemberDto: CreateMemberDto): Promise<void> {
    const member = new Member(createMemberDto);
    await this.entityManager.save(member);
  }
  // find all members
  async findAll(): Promise<{ message: string; data: Member[] } | string> {
    const allMembers = await this.memberRepository.find();
    if (allMembers) {
      return {
        message: "Des membres ont été trouvés",
        data: allMembers,
      };
    } else {
      return "Aucun membre trouvé";
    }
  }
  // Find one member by ID
  async findOne(
    id: number,
  ): Promise<{ message: string; data: Member } | undefined> {
    try {
      const oneMemberFoud = await this.memberRepository.findOne({
        where: { arm_member_id: id },
      });

      if (!oneMemberFoud) {
        throw new NotFoundException(`Le member avec l'id: ${id} n'existe pas`);
      }

      if (oneMemberFoud) {
        return {
          message: "le membre a été trouvé",
          data: oneMemberFoud,
        };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Erreur lors de la récupération du membre",
      );
    }
  }
  // Update a member by ID thanks to the Member ID
  // returns the number of row affected
  async update(id: number, updateData: UpdateMemberDto): Promise<number> {
    const result: UpdateResult = await this.memberRepository.update(
      id,
      updateData,
    );
    return result.affected!;
  }
  // Delete a member by ID thanks to the member ID
  // Returns a confirmation message
  async delete(@Param("id", ParseIntPipe) id: number): Promise<string> {
    await this.memberRepository.delete(id);
    return "Le membre a bien été effacé";
  }
}
