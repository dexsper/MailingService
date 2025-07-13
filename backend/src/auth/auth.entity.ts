import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../users/user.entity';

@Entity('auth_logs')
export class AuthLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip_address: string;

  @Column()
  user_agent: string;

  @Column()
  country: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column()
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
