"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const cart_service_1 = require("../cart/cart.service");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    ordersRepository;
    cartService;
    productsService;
    dataSource;
    constructor(ordersRepository, cartService, productsService, dataSource) {
        this.ordersRepository = ordersRepository;
        this.cartService = cartService;
        this.productsService = productsService;
        this.dataSource = dataSource;
    }
    async checkout(user) {
        const cart = await this.cartService.getCart(user);
        if (!cart.items || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let totalPrice = 0;
            const orderItems = [];
            for (const cartItem of cart.items) {
                const product = await this.productsService.findOne(cartItem.product.id);
                if (product.stock < cartItem.quantity) {
                    throw new common_1.BadRequestException(`Product ${product.title} is out of stock`);
                }
                product.stock -= cartItem.quantity;
                await queryRunner.manager.save(product);
                const orderItem = new order_item_entity_1.OrderItem();
                orderItem.product = product;
                orderItem.quantity = cartItem.quantity;
                orderItem.price = product.price;
                orderItems.push(orderItem);
                totalPrice += Number(product.price) * cartItem.quantity;
            }
            const order = new order_entity_1.Order();
            order.user = user;
            order.items = orderItems;
            order.totalPrice = totalPrice;
            const savedOrder = await queryRunner.manager.save(order_entity_1.Order, order);
            await queryRunner.commitTransaction();
            await this.cartService.clearCart(user);
            return savedOrder;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    findAll(user) {
        return this.ordersRepository.find({
            where: { user: { id: user.id } },
            relations: ['items', 'items.product'],
            order: { createdAt: 'DESC' }
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cart_service_1.CartService,
        products_service_1.ProductsService,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map