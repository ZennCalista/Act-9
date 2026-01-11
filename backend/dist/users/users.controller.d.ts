import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    checkUsername(username: string): Promise<{
        available: boolean;
    }>;
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        username: string;
        role: import("./entities/user.entity").UserRole;
        products: import("../products/entities/product.entity").Product[];
    } | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
