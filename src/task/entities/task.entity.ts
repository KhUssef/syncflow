import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, DeleteDateColumn } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { User } from '../../user/entities/user.entity';
import { text } from 'express';
import { Relation } from 'typeorm';
@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true, type:"text" })
  description: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @ManyToOne(() => Company, company => company.tasks)
  company: Relation<Company>;

  @ManyToOne(() => User, user => user.tasks, { nullable: true })
  assignedTo: Relation<User>;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
