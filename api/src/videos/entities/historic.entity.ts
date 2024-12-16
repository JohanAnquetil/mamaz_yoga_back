import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { VideoDescription } from "./videos_description.entity";
import { User } from "@app/users/entities/user.entity";


// @Entity({ name: "videos_history" })
// export class VideoHistory {
//   @PrimaryGeneratedColumn("increment", { name: "id" })
//   id!: number;

//   @ManyToOne(() => VideoDescription, (video) => video.videoHistories, { nullable: false })
//   @JoinColumn({ name: "video" })
//   video!: VideoDescription;

//   @ManyToOne(() => User, (user) => user.id, { nullable: false })
//   @JoinColumn({ name: "user" })
//   user!: User;
// }

@Entity({ name: 'videos_history' })
export class VideoHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.videoHistories, { eager: true }) // Relation avec User
  @JoinColumn({ name: 'user' })
  user!: User;

  @ManyToOne(() => VideoDescription, (video) => video.videoHistories, { eager: true }) // Relation avec VideoDescription
  @JoinColumn({ name: 'video' })
  video!: VideoDescription;

  @Column('datetime')
  date!: Date;

  @Column("bigint", {name: "viewing_time_in_minutes", nullable: false,default: 0})
  viewingTime!: number;
}