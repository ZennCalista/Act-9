import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED"
}
export declare class Order {
    id: string;
    user: User;
    items: OrderItem[];
    totalPrice: number;
    status: OrderStatus;
    createdAt: Date;
}
