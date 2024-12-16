// import { Module } from '@nestjs/common';
// import { VideosController } from './videos.controller';
// import { VideosService } from './videos.service';

// @Module({
//   controllers: [VideosController],
//   providers: [VideosService]
// })
// export class VideosModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideosController } from "./videos.controller";
import { VideosService } from "./videos.service";
import { VideoCategory } from "./entities/categories.entity";
import { User } from "@app/users/entities/user.entity";
import { VideoHistory } from "./entities/historic.entity";
import { VideoDescription } from "./entities/videos_description.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoDescription,
      VideoHistory,
      VideoCategory,
      User,
    ]),
  ],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
