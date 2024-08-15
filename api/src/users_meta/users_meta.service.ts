import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUsersMetaDto } from "./dto/create-users_meta.dto";
import { UpdateUsersMetaDto } from "./dto/update-users_meta.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersMeta } from "./entities/users_meta.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersMetaService {
  constructor(
    @InjectRepository(UsersMeta)
    private readonly usersMetaRepository: Repository<UsersMeta>,
    //private readonly entityManager: EntityManager
  ) {}

  async create(createUsersMetaDto: CreateUsersMetaDto): Promise<string> {
    const userMetas = new UsersMeta(createUsersMetaDto);
    await this.usersMetaRepository.save(createUsersMetaDto);
    return "Un user meta a été créé";
  }

  async findAll(): Promise<UsersMeta[]> {
    return await this.usersMetaRepository.find();
  }

  async findOne(id: number): Promise<UsersMeta | undefined> {
    try {
      const userMetas = await this.usersMetaRepository.findOne({
        where: { umetaId: id },
      });
      if (!userMetas) {
        throw new NotFoundException(`Le member avec l'id: ${id} n'existe pas`);
      }
      return userMetas;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updateUsersMetaDto: UpdateUsersMetaDto) {
    const updateUserMetas = await this.usersMetaRepository.update(
      id,
      updateUsersMetaDto,
    );
    return updateUserMetas.affected;
  }

  async remove(id: number): Promise<void> {
    await this.usersMetaRepository.delete(id);
  }
}
