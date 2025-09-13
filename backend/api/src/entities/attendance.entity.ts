import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./employee.entity";
import { AttendanceStatus } from "./attenance-status.entity";

@Index("fk_attendance_employee", ["employeeId"], {})
@Index("fk_attendance_status", ["statusId"], {})
@Entity("attendance", { schema: "attendance" })
export class Attendance {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "employee_id", unsigned: true })
  employeeId: number;

  @Column("datetime", { name: "attendance_dttm" })
  attendanceDttm: Date;

  @Column("int", { name: "status_id", unsigned: true })
  statusId: number;

  @ManyToOne(() => Employee, (employee) => employee.attendances, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: Employee;

  @ManyToOne(
    () => AttendanceStatus,
    (attendanceStatus) => attendanceStatus.attendances,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "status_id", referencedColumnName: "id" }])
  status: AttendanceStatus;
}
