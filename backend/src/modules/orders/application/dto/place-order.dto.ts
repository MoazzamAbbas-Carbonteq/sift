import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

function trimString({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class PlaceOrderDto {
  @ApiProperty({ example: 'Alex Rivera', maxLength: 255 })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  shippingName: string;

  @ApiProperty({
    example: '120 Market Street, Seattle, WA 98101',
    maxLength: 2000,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  shippingAddress: string;
}
