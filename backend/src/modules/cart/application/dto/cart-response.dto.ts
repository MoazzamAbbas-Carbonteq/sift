import { ApiProperty } from '@nestjs/swagger';

export class CartLineDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  productId: string;

  @ApiProperty({ example: 'Sony WH-1000XM5' })
  name: string;

  @ApiProperty({ example: 'https://picsum.photos/seed/sift-sony-wh-1000xm5/800/800' })
  imageUrl: string;

  @ApiProperty({ example: 39999, description: 'Current price in integer cents' })
  priceCents: number;

  @ApiProperty({ example: true })
  freeShipping: boolean;

  @ApiProperty({ example: true })
  inStock: boolean;

  @ApiProperty({ example: 1, minimum: 1 })
  quantity: number;

  @ApiProperty({ example: 39999, description: 'priceCents multiplied by quantity' })
  lineTotalCents: number;
}

export class CartResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ type: [CartLineDto] })
  items: CartLineDto[];

  @ApiProperty({ example: 39999, description: 'Integer cents' })
  subtotalCents: number;

  @ApiProperty({ example: 0, description: 'Integer cents' })
  shippingCents: number;

  @ApiProperty({ example: 3200, description: 'Integer cents' })
  taxCents: number;

  @ApiProperty({ example: 43199, description: 'Integer cents' })
  totalCents: number;
}
