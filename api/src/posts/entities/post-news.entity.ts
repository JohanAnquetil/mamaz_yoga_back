import { PostsMeta } from "@app/posts_meta/entities/posts_meta.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from "typeorm";

@Entity({ name: "mod350_posts" })
export class PostNews {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Index()
  @Column("bigint", { name: "post_author", default: 0 })
  postAuthor!: number;

  @Column({ type: "datetime", nullable: true, name: "post_date" })
  postDate?: Date;

  @Column("timestamp", {
    nullable: true,
    name: "post_date_gmt",
    default: () => "CURRENT_TIMESTAMP",
  })
  postDateGmt?: Date | null;

  @Column("longtext", { name: "post_content", nullable: true })
  postContent?: string;

  @Column("text", { name: "post_title" })
  postTitle!: string;

  @Column("text", { name: "post_excerpt", nullable: true })
  postExcerpt?: string;

  @Column("varchar", { length: 20, name: "post_status", default: "publish" })
  postStatus!: string;

  @Column("varchar", { length: 20, name: "comment_status", default: "open" })
  commentStatus!: string;

  @Column("varchar", { length: 20, name: "ping_status", default: "open" })
  pingStatus!: string;

  @Column("varchar", { length: 255, name: "post_password", nullable: true })
  postPassword?: string;

  @Column("varchar", { length: 200, name: "post_name", nullable: true })
  postName?: string;

  @Column("text", { name: "to_ping", nullable: true })
  toPing?: string;

  @Column("text", { name: "pinged", nullable: true })
  pinged?: string;

  @Column("timestamp", {
    name: "post_modified",
    default: () => "CURRENT_TIMESTAMP",
  })
  postModified?: Date;

  @Column("timestamp", {
    name: "post_modified_gmt",
    default: () => "CURRENT_TIMESTAMP",
  })
  postModifiedGmt!: Date;

  @Column("longtext", { name: "post_content_filtered", nullable: true })
  postContentFiltered?: string;

  @Column("bigint", { name: "post_parent", default: 0 })
  postParent!: number;

  @Column("varchar", { length: 255, name: "guid", nullable: true })
  guid?: string;

  @Column("int", { name: "menu_order", default: 0 })
  menuOrder!: number;

  @Column("varchar", { length: 20, name: "post_type", default: "postNews" })
  postType!: string;

  @Column("varchar", { length: 100, name: "post_mime_type", nullable: true })
  postMimeType?: string;

  @Column("bigint", { name: "comment_count", default: 0 })
  commentCount!: number;

  @OneToMany(() => PostsMeta, (postMeta: any) => postMeta.postNews)
  postsMeta!: PostsMeta[];

  constructor(postNews: Partial<PostNews>) {
    Object.assign(this, postNews);
  }
}
