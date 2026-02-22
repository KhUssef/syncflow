import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
import { Relation } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;


  @ManyToOne(() => Company, company => company.events)
  company: Relation<Company>;

  @Column()
  description: string;


  @Column()
  date: Date;

  @ManyToOne(() => User, createdBy => createdBy.events)
  createdBy: Relation<User>;
}
