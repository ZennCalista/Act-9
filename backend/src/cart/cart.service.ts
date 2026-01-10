import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    private productsService: ProductsService,
  ) {}

  async getCart(user: User) {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product', 'user'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  async addToCart(user: User, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;
    const product = await this.productsService.findOne(productId);

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const cart = await this.getCart(user);
    
    // Check if item already exists in cart
    let cartItem = await this.cartItemRepository.findOne({
        where: { cart: { id: cart.id }, product: { id: productId } },
    });

    if (cartItem) {
        if (product.stock < cartItem.quantity + quantity) {
            throw new BadRequestException('Insufficient stock for update');
        }
        cartItem.quantity += quantity;
    } else {
        cartItem = this.cartItemRepository.create({
            cart,
            product,
            quantity,
        });
    }

    await this.cartItemRepository.save(cartItem);
    return this.getCart(user);
  }

  async removeItem(user: User, itemId: string) {
    const cart = await this.getCart(user);
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { id: cart.id } },
    });
    
    if (!item) throw new NotFoundException('Item not found in cart');
    
    await this.cartItemRepository.remove(item);
    return this.getCart(user);
  }
  
  async clearCart(user: User) {
      const cart = await this.getCart(user);
      await this.cartItemRepository.delete({ cart: { id: cart.id } });
  }
}
