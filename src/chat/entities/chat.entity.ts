import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Message } from './message.entity';
import { Relation } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'public' })
  type: string; // 'public' for now, can extend later

  @ManyToOne(() => Company, company => company.id)
  company: Relation<Company>;

  @OneToMany(() => Message, message => message.chat, { cascade: true })
  messages: Relation<Message[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}