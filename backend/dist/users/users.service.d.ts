import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findOneByUsername(username: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        username: string;
        role: import("./entities/user.entity").UserRole;
        products: import("../products/entities/product.entity").Product[];
    } | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
