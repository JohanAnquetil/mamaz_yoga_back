  import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
  import { User } from "@app/users/entities/user.entity";
  import { VideosTags } from "@app/videos/entities/tags.entity";

  @Entity('tags_preferences_user')
  export class TagsPreferencesUser {
    @PrimaryColumn({ type: 'bigint' })
    user_id!: number;

    @PrimaryColumn({ type: 'bigint', unsigned: true })
    tags_id!: number;

  @ManyToOne(() => User, (user) => user.id, { 
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    userId!: User;

  @ManyToOne(() => VideosTags, (tags) => tags.id, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'tags_id' })
    videosTags!: VideosTags;
  }
