import { User } from '../../users/entities/user.entity';
export declare class Product {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    stock: number;
    isActive: boolean;
    seller: User;
}
