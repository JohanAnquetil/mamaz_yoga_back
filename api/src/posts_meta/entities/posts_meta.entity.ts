import { PostNews } from "@app/posts/entities/post-news.entity";
import { AutoIncrement } from "sequelize-typescript";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  EntitySchemaOptions,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity({ name: "mod350_postmeta" })
export class PostsMeta {
  @PrimaryGeneratedColumn("increment")
  meta_id!: number;

  @Column("bigint", { name: "post_id", default: 0 })
  postId!: number;

  @Column("varchar", { name: "meta_key", nullable: true })
  metaKey?: string;

  @Column("longtext", { name: "meta_value", nullable: true })
  metaValue?: string;

  @ManyToOne(() => PostNews, (postNews) => postNews.postsMeta)
  @JoinColumn({ name: "post_id" })
  postNews!: PostNews[];

  constructor(postMetas: Partial<PostsMeta>) {
    Object.assign(this, postMetas);
  }
}
