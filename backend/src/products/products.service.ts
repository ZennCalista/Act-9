import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private usersService: UsersService,
  ) {}

  async assignOrphanProductsToSeller(username: string) {
    const seller = await this.usersService.findOneByUsername(username);
    if (!seller) {
      throw new NotFoundException(`User ${username} not found`);
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

  create(createProductDto: CreateProductDto, user: User) {
    const product = this.productsRepository.create({
      ...createProductDto,
      seller: user
    });
    return this.productsRepository.save(product);
  }

  findAll() {
    return this.productsRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return this.productsRepository.remove(product);
  }
}
