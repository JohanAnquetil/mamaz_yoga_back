import { Module } from "@nestjs/common";
import { UsersMetaService } from "./users_meta.service";
import { UsersMetaController } from "./users_meta.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersMeta } from "./entities/users_meta.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UsersMeta])],
  controllers: [UsersMetaController],
  providers: [UsersMetaService],
})
export class UsersMetaModule {}
