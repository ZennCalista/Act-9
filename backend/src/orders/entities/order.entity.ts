import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column('decimal')
  totalPrice: number;

  @Column({
      type: 'simple-enum',
      enum: OrderStatus,
      default: OrderStatus.COMPLETED // Immediate completion for this demo
  })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;
}
