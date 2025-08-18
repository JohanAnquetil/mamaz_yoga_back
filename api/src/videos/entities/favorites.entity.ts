import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { VideoDescription } from "./videos_description.entity";
import { User } from "@app/users/entities/user.entity";


@Entity('videos_favorites')
export class VideosFavorites {
  
  @PrimaryColumn({ type: 'bigint' })
  video!: number;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  user!: number;

  @Column({ type: 'datetime', nullable: false })
  date!: Date;

  @Column({ type: 'bigint', default: 0, nullable: false })
  viewing_time_in_minutes!: number;

  @ManyToOne(() => VideoDescription, (video) => video.videoHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video' })
  videoEntity!: VideoDescription;

  @ManyToOne(() => User, (user) => user.videoHistories, { eager: true })
   @JoinColumn({ name: 'user' })
   userEntity!: User;
}