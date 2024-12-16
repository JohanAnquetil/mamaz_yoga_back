import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
import { VideoDescription } from "./videos_description.entity";
  
@Entity({name: "videos_categories"})

export class VideoCategory {
    @PrimaryGeneratedColumn("increment", { name: "id" })
    id!: number;

    @Column("varchar", { length:500, name: "category", nullable: false } )
    category!: string;
    
    @OneToMany(() => VideoDescription, (videoDescription) => videoDescription.category)
    videoDescriptions!: VideoDescription[]; 
}