import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  productId: string;

  @ApiProperty({ example: 'Sony WH-1000XM5' })
  productName: string;

  @ApiProperty({
    example: 39999,
    description: 'Purchase-time unit price in integer cents',
  })
  unitPriceCents: number;

  @ApiProperty({ example: 1, minimum: 1 })
  quantity: number;

  @ApiProperty({ example: 39999, description: 'Integer cents' })
  lineTotalCents: number;
}

export class OrderResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'placed', enum: ['placed'] })
  status: 'placed';

  @ApiProperty({ example: 39999, description: 'Integer cents' })
  subtotalCents: number;

  @ApiProperty({ example: 0, description: 'Integer cents' })
  shippingCents: number;

  @ApiProperty({ example: 3200, description: 'Integer cents' })
  taxCents: number;

  @ApiProperty({ example: 43199, description: 'Integer cents' })
  totalCents: number;

  @ApiProperty({ example: 'Alex Rivera' })
  shippingName: string;

  @ApiProperty({ example: '120 Market Street, Seattle, WA 98101' })
  shippingAddress: string;

  @ApiProperty({ example: '2026-10-01T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];
}
