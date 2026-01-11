import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({ description: 'The new quantity for the item', example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
