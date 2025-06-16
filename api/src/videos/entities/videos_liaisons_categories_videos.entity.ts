import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { VideoDescription } from "./videos_description.entity";
import { VideoCategory } from "./categories.entity";

@Entity('videos_liaisons_categories_videos')
export class VideosLiaisonsCategoriesVideos {
  // 🟢 Clés Primaires Composites
  @PrimaryColumn({ type: 'bigint' })
  video_id!: number;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  categorie_id!: number;

@ManyToOne(() => VideoDescription, (video) => video.liaisons, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'video_id' })
  videoEntity!: VideoDescription;


 @ManyToOne(() => VideoCategory, (category) => category.liaisons, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categorie_id' })
  categoryEntity!: VideoCategory;
}
