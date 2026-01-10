import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';
export declare class OrdersService {
    private ordersRepository;
    private cartService;
    private productsService;
    private dataSource;
    constructor(ordersRepository: Repository<Order>, cartService: CartService, productsService: ProductsService, dataSource: DataSource);
    checkout(user: User): Promise<Order>;
    findAll(user: User): Promise<Order[]>;
}
