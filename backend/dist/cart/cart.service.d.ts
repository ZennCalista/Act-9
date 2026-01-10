import { Repository } from 'typeorm';
import { AddToCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';
export declare class CartService {
    private cartRepository;
    private cartItemRepository;
    private productsService;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, productsService: ProductsService);
    getCart(user: User): Promise<Cart>;
    addToCart(user: User, addToCartDto: AddToCartDto): Promise<Cart>;
    removeItem(user: User, itemId: string): Promise<Cart>;
    clearCart(user: User): Promise<void>;
}
