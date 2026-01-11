import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<import("./entities/cart.entity").Cart>;
    addToCart(req: any, addToCartDto: AddToCartDto): Promise<import("./entities/cart.entity").Cart>;
    updateItem(req: any, itemId: string, body: UpdateCartDto): Promise<import("./entities/cart.entity").Cart>;
    removeItem(req: any, itemId: string): Promise<import("./entities/cart.entity").Cart>;
}
