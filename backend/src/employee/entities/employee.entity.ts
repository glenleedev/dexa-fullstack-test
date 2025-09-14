import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Attendance } from "../../attendance/entities/attendance.entity";
import { Position } from "../../employee/entities/position.entity";
import { User } from "../../user/entities/user.entity";

@Index("fk_employee_user", ["userId"], {})
@Index("fk_employee_position", ["positionId"], {})
@Entity("employee", { schema: "attendance" })
export class Employee {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;
  
  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("varchar", { name: "first_name", length: 255 })
  firstName: string;

  @Column("varchar", { name: "last_name", nullable: true, length: 255 })
  lastName: string | null;

  @Column("int", { name: "position_id", unsigned: true })
  positionId: number;

  @Column("varchar", { name: "phone", nullable: true, length: 30 })
  phone: string | null;

  @Column("varchar", { name: "photo", nullable: true, length: 255 })
  photo: string | null;

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

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[];

  @ManyToOne(() => Position, (position) => position.employees, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "position_id", referencedColumnName: "id" }])
  position: Position;

  @ManyToOne(() => User, (user) => user.employees, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
