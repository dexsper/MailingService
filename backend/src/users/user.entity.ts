import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120, unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  tokenVersion: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.User],
  })
  roles: UserRole[];

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
