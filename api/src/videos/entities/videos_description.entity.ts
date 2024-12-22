import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VideoCategory } from "./categories.entity";
import { VideosHistory } from "./historic.entity";

@Entity({ name: "videos_description" })
export class VideoDescription {
  @PrimaryGeneratedColumn("increment", { name: "id" })
  id!: number;

  @Column("text", { name: "name", nullable: false })
  name!: string;

  @Column("text", { name: "path", nullable: false })
  path!: string;

  @Column("tinyint", { name: "is_free_video", nullable: false })
  isFreeVideo!: boolean;

  @Column("text", { name: "thumbnail", nullable: false })
  thumbnail!: string;

  @Column("date", { name: "date", nullable: false, default: () => "'1970-01-01'" })
  date!: string;

  @Column ("int", {name: "lenght", nullable: false})
  lenght!: number;

  @ManyToOne(() => VideoCategory, (videoCategory) => videoCategory.videoDescriptions, { nullable: false })
  @JoinColumn({ name: "category" })
  category!: VideoCategory; 

  @OneToMany(() => VideosHistory, (videoHistory) => videoHistory.video)
  videoHistories!: VideosHistory[];

  get fullThumbnailPath(): string {
    return `/usr/src/app/videos/${this.thumbnail}`;
  }

  get fullVideoPath(): string {
    return `/usr/src/app/videos/${this.path}`;
  }

}