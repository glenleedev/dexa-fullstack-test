import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./employee.entity";

@Index("name", ["name"], { unique: true })
@Entity("position", { schema: "attendance" })
export class Position {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

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

  @OneToMany(() => Employee, (employee) => employee.position)
  employees: Employee[];
}
