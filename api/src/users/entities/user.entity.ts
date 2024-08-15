import { UsersMeta } from "@app/users_meta/entities/users_meta.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "mod350_users" })
export class User {
  @PrimaryGeneratedColumn("increment", { name: "ID" })
  id!: number;

  @Column("varchar", { length: 60, name: "user_login", nullable: false })
  userLogin!: string;

  @Column("varchar", { length: 255, name: "user_pass", nullable: false })
  userPass!: string;

  @Column("varchar", { length: 50, name: "user_nicename", nullable: false })
  userNicename!: string;

  @Column("varchar", { length: 100, name: "user_email", nullable: false })
  userEmail!: string;

  @Column("varchar", { length: 100, name: "user_url", nullable: true })
  userUrl?: string;

  @Column({ name: "user_registered", type: "timestamp", nullable: false })
  userRegistered?: Date;

  @Column("varchar", {
    length: 255,
    name: "user_activation_key",
    nullable: true,
  })
  userActivationKey?: string;

  @Column("int", { name: "user_status", default: 0, nullable: false })
  userStatus!: number;

  @Column("varchar", { length: 250, name: "display_name", nullable: false })
  displayName!: string;

  @OneToMany(() => UsersMeta, (userMetas) => userMetas.user)
  usersMetas!: UsersMeta[];

  constructor(users: Partial<User>) {
    Object.assign(this, users);
  }
}