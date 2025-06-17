import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VideoCategory } from "./categories.entity";
import { VideosHistory } from "./historic.entity";
import { VideosFavorites } from "./favorites.entity";
import { VideosLiaisonsCategoriesVideos } from "./videos_liaisons_categories_videos.entity";

@Entity({ name: "videos_description" })
export class VideoDescription {
  @PrimaryGeneratedColumn("increment", { name: "id" })
  id!: number;

  @Column({ type: "int", nullable: false, default: 0 })
  position!: number;

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

  @Column("simple-array", { name: "tags", nullable: false, default:"" })
  tags!: string[];

  @ManyToOne(() => VideoCategory, (videoCategory) => videoCategory.videos, { nullable: false })
  @JoinColumn({ name: "category" })
  category!: VideoCategory; 

  @OneToMany(() => VideosLiaisonsCategoriesVideos, (liaison) => liaison.videoEntity)
  liaisons!: VideosLiaisonsCategoriesVideos[];

  @OneToMany(() => VideosHistory, (videoHistory) => videoHistory.video)
  videoHistories!: VideosHistory[];

  @OneToMany(() => VideosFavorites, (videoFavorites) => videoFavorites.video)
  videoFavorites!: VideosFavorites[];

  get fullThumbnailPath(): string {
    return `/usr/src/app/videos/${this.thumbnail}`;
  }

  get fullVideoPath(): string {
    return `/usr/src/app/videos/${this.path}`;
  }

}
