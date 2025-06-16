import {
    Column,
    Entity,
    PrimaryColumn,
  } from "typeorm";
  
@Entity({name: "videos_tag"})

export class VideosUserTags {
    @PrimaryColumn({ type: 'bigint' })
    id!: number;

    @Column("varchar", { length:500, name: "tag", nullable: false } )
    tag!: string;
    
}