import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user);
  }

  @Post()
  addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user, addToCartDto);
  }

  @Patch(':itemId')
  updateItem(@Request() req, @Param('itemId') itemId: string, @Body() body: { quantity: number }) {
    return this.cartService.updateItem(req.user, itemId, body.quantity);
  }

  @Delete(':itemId')
  removeItem(@Request() req, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user, itemId);
  }
}
