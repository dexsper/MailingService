import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';

@Entity('mailboxes')
export class MailboxEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  host: string;

  @Column()
  port: number;

  @Column()
  secure: boolean;

  @Column()
  password: string;

  @JoinColumn({ name: 'userId' })
  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ unique: true })
  userId: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    select: false,
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    select: false,
  })
  updatedDate: Date;
}
