import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
export declare class ProductsService {
    private productsRepository;
    private usersService;
    constructor(productsRepository: Repository<Product>, usersService: UsersService);
    assignOrphanProductsToSeller(username: string): Promise<{
        message: string;
    }>;
    create(createProductDto: CreateProductDto, user: User): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<Product>;
}
