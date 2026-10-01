import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export const MAX_CART_QUANTITY = 99;

export class AddCartItemDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: MAX_CART_QUANTITY })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_CART_QUANTITY)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 2, minimum: 1, maximum: MAX_CART_QUANTITY })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_CART_QUANTITY)
  quantity: number;
}
