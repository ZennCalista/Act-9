import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<import("./entities/cart.entity").Cart>;
    addToCart(req: any, addToCartDto: AddToCartDto): Promise<import("./entities/cart.entity").Cart>;
    removeItem(req: any, itemId: string): Promise<import("./entities/cart.entity").Cart>;
}
