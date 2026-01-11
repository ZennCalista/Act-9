import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('decimal')
  price: number;

  @Column('int')
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.products, { eager: true }) // Added eager: true to always fetch seller info
  seller: User;
}
