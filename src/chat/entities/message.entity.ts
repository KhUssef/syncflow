import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Chat } from './chat.entity';
import { Relation } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => User, user => user.id)
  sender: Relation<User>;

  @ManyToOne(() => Chat, chat => chat.messages)
  chat: Relation<Chat>;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}