import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

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

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}
