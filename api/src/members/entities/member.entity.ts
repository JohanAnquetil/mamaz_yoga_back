import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: "mod350_arm_members" })
export class Member {
  @PrimaryGeneratedColumn("increment")
  arm_member_id!: number;

  @Column({ type: "bigint", nullable: false })
  arm_user_id!: number;

  @Column({ type: "varchar", length: 60, nullable: false })
  arm_user_login!: string;

  @Column({ type: "varchar", length: 64, nullable: false })
  arm_user_pass!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  arm_user_nicename!: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  arm_user_email!: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  arm_user_url!: string;

  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  arm_user_registered!: Date;

  @Column({ type: "int", nullable: false, default: 0 })
  arm_user_status!: number;

  @Column({ type: "int", nullable: false, default: 0 })
  arm_secondary_status!: number;

  @Column({ type: "text", nullable: true })
  arm_user_plan_ids?: string;

  @Column({ type: "text", nullable: true })
  arm_user_suspended_plan_ids?: string;

  constructor(member: Partial<Member>) {
    Object.assign(this, member);
  }
}
