import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private cartService: CartService,
    private productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  async checkout(user: User) {
    const cart = await this.cartService.getCart(user);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Start Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalPrice = 0;
      const orderItems: OrderItem[] = [];

      for (const cartItem of cart.items) {
        const product = await this.productsService.findOne(cartItem.product.id); // Ensure fresh data
        
        if (product.stock < cartItem.quantity) {
          throw new BadRequestException(`Product ${product.title} is out of stock`);
        }

        // Deduct Stock
        product.stock -= cartItem.quantity;
        await queryRunner.manager.save(product);

        // Prepare Order Item
        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = cartItem.quantity;
        orderItem.price = product.price; // Snapshot price
        orderItems.push(orderItem);

        totalPrice += Number(product.price) * cartItem.quantity;
      }

      // Create Order
      const order = new Order();
      order.user = user;
      order.items = orderItems;
      order.totalPrice = totalPrice;
      
      const savedOrder = await queryRunner.manager.save(Order, order);

      // Commit Transaction
      await queryRunner.commitTransaction();

      // Clear Cart (can be done outside transaction or inside, better outside to not lock cart table unnecessarily, although safer inside)
      // For simplicity doing it here via service which is separate. 
      // Actually CartService.clearCart is simple delete.
      await this.cartService.clearCart(user);

      return savedOrder;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(user: User) {
    return this.ordersRepository.find({
        where: { user: { id: user.id } },
        relations: ['items', 'items.product'],
        order: { createdAt: 'DESC' }
    });
  }
}
