import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  SELLER = 'SELLER',
  BUYER = 'BUYER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.BUYER,
  })
  role: UserRole;
}
