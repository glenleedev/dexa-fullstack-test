import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Index("name", ["name"], { unique: true })
@Entity("role", { schema: "attendance" })
export class Role {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 50 })
  name: string;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  description: string | null;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
