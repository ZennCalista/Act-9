import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    assignLegacy(): Promise<{
        message: string;
    }>;
    create(body: any, file: Express.Multer.File, req: any): Promise<import("./entities/product.entity").Product>;
    findAll(): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    update(id: string, body: any, file: Express.Multer.File): Promise<import("./entities/product.entity").Product>;
    remove(id: string): Promise<import("./entities/product.entity").Product>;
}
