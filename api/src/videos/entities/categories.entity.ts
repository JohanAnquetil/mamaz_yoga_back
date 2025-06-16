import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
import { VideosLiaisonsCategoriesVideos } from "./videos_liaisons_categories_videos.entity";
  
@Entity({name: "videos_categories"})

export class VideoCategory {
    @PrimaryGeneratedColumn("increment", { name: "id" })
    id!: number;

    @Column("varchar", { length:500, name: "category", nullable: false } )
    category!: string;
    
    @Column({ type: "int", nullable: false, default: 0 })
    position!: number;
    
    @OneToMany(() => VideosLiaisonsCategoriesVideos, (liaison) => liaison.categoryEntity)
    liaisons!: VideosLiaisonsCategoriesVideos[]; 
}