import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("employee_audit", { schema: "audit" })
export class EmployeeAudit {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "employee_id" })
  employeeId: string;

  @Column("json", { name: "payload" })
  payload: object;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
}
