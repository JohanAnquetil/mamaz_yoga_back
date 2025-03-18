import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { VideoDescription } from "./videos_description.entity";
import { User } from "@app/users/entities/user.entity";


@Entity('videos_favorites')
export class VideosFavorites {
  
  // 🟢 Clés Primaires Composites
  @PrimaryColumn({ type: 'bigint' })
  video!: number;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  user!: number;

  // 🟢 Colonne Date
  @Column({ type: 'datetime', nullable: false })
  date!: Date;

  // 🟢 Durée de visionnage
  @Column({ type: 'bigint', default: 0, nullable: false })
  viewing_time_in_minutes!: number;

  // 🟢 Relation avec Video
  @ManyToOne(() => VideoDescription, (video) => video.videoHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video' })
  videoEntity!: VideoDescription;

  // 🟢 Relation avec User
  @ManyToOne(() => User, (user) => user.videoHistories, { eager: true })
   @JoinColumn({ name: 'user' })
   userEntity!: User;
}