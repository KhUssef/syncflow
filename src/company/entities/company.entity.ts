import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, DeleteDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Note } from '../../note/entities/note.entity';
import { Task } from '../../task/entities/task.entity';
import { Operation } from 'src/history/entities/operation.entity';
import { Event } from '../../events/entities/event.entity';
import { Relation } from 'typeorm';
@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; 

  @Column()
  name: string;

  @OneToMany(() => User, user => user.company)
  users: Relation<User[]>;

  @OneToMany(() => Note, note => note.company)
  notes: Relation<Note[]>;

  @OneToMany(() => Task, task => task.company)
  tasks: Relation<Task[]>;

  @OneToMany(() => Event, Event => Event.company)
  events: Relation<Event[]>;

  @OneToMany(() => Operation, operation => operation.company)
  operations: Relation<Operation[]>; // Assuming Operation has a company relation


  @DeleteDateColumn()
  deletedAt?: Date;

}
