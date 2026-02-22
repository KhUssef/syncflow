import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, DeleteDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
import { Task } from '../../task/entities/task.entity';
import { NoteLine } from './noteline.entity';
import { Relation } from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Company, company => company.notes)
  company: Relation<Company>;

  @OneToMany(() => NoteLine, line => line.note, { cascade: true })
  lines: Relation<NoteLine[]>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({default: 20})
  lineCount: number;
  @DeleteDateColumn()
  deletedAt?: Date;
  
}
