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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const users_service_1 = require("../users/users.service");
let ProductsService = class ProductsService {
    productsRepository;
    usersService;
    constructor(productsRepository, usersService) {
        this.productsRepository = productsRepository;
        this.usersService = usersService;
    }
    async assignOrphanProductsToSeller(username) {
        const seller = await this.usersService.findOneByUsername(username);
        if (!seller) {
            throw new common_1.NotFoundException(`User ${username} not found`);
        }
        const orphans = await this.productsRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.seller', 'seller')
            .where('product.sellerId IS NULL')
            .getMany();
        for (const product of orphans) {
            product.seller = seller;
            await this.productsRepository.save(product);
        }
        return { message: `Assigned ${orphans.length} products to ${username}` };
    }
    create(createProductDto, user) {
        const product = this.productsRepository.create({
            ...createProductDto,
            seller: user
        });
        return this.productsRepository.save(product);
    }
    findAll() {
        return this.productsRepository.find({ where: { isActive: true } });
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        Object.assign(product, updateProductDto);
        return this.productsRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        return this.productsRepository.remove(product);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], ProductsService);
//# sourceMappingURL=products.service.js.map