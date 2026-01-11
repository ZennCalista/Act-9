import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, User } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('fix/assign-legacy')
  async assignLegacy() {
    return this.productsService.assignOrphanProductsToSeller('seller');
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SELLER)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        description: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Request() req) {
    const createProductDto: CreateProductDto = {
      ...body,
      price: Number(body.price),
      stock: Number(body.stock),
      imageUrl: file ? `/uploads/${file.filename}` : undefined,
    };
    // req.user contains the JWT payload. We construct a partial User object with the ID.
    const user = { id: req.user.id } as User; 
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SELLER)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', nullable: true },
        price: { type: 'number', nullable: true },
        stock: { type: 'number', nullable: true },
        description: { type: 'string', nullable: true },
        image: {
          type: 'string',
          format: 'binary',
          nullable: true
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  update(
    @Param('id') id: string, 
    @Body() body: any, 
    @UploadedFile() file: Express.Multer.File
  ) {
    const updateProductDto: UpdateProductDto = {
      ...body,
      price: body.price ? Number(body.price) : undefined,
      stock: body.stock ? Number(body.stock) : undefined,
    };
    if (file) {
      updateProductDto.imageUrl = `/uploads/${file.filename}`;
    }
    return this.productsService.update(id, updateProductDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SELLER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
