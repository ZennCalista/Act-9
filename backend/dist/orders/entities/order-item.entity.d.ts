import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    product: Product;
    quantity: number;
    price: number;
}
