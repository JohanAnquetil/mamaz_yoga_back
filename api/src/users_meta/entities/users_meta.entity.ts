import { User } from "@app/users/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "mod350_usermeta" })
export class UsersMeta {
  @PrimaryGeneratedColumn("increment", { name: "umeta_id" })
  umetaId!: number;

  @Column("bigint", { default: 0, name: "user_id" })
  userId!: number;

  @Column("varchar", {
    length: 255,
    name: "meta_key",
    nullable: true,
    default: null,
  })
  metaKey?: string;

  @Column("longtext", { name: "meta_value", nullable: true, default: null })
  metaValue?: string;

  @ManyToOne(() => User, (user) => user.usersMetas)
  @JoinColumn({ name: "user_id" })
  user!: User;

  constructor(userMetas: Partial<UsersMeta>) {
    Object.assign(this, userMetas);
  }
}
