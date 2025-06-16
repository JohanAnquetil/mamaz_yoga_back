import {
    Column,
    Entity,
    PrimaryColumn,
  } from "typeorm";
import { VideosLiaisonsCategoriesVideos } from "./videos_liaisons_categories_videos.entity";
  
@Entity({name: "videos_tag"})

export class VideosTags {
    @PrimaryColumn({ type: 'bigint' })
    id!: number;

    @Column("varchar", { length:500, name: "tag", nullable: false } )
    tag!: string;
    
}