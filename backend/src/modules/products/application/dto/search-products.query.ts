import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { PRODUCT_SORTS, type ProductSort } from '../../domain/product-search.js';

@ValidatorConstraint({ name: 'attributeFilter', async: false })
class AttributeFilterConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && isAttributeFilter(value);
  }

  defaultMessage(): string {
    return 'attribute must be key:value with a snake_case key';
  }
}

export class SearchProductsQueryDto {
  @ApiPropertyOptional({ example: 'wireless headphones' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;

  @ApiPropertyOptional({
    example: 'headphones',
    description: 'Category slug',
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @ApiPropertyOptional({
    example: 10000,
    description: 'Minimum price in integer cents',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    example: 20000,
    description: 'Maximum price in integer cents',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 4, minimum: 0, maximum: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => parseQueryBoolean(value))
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => parseQueryBoolean(value))
  @IsBoolean()
  freeShipping?: boolean;

  @ApiPropertyOptional({
    enum: PRODUCT_SORTS,
    default: 'rating_desc',
  })
  @IsOptional()
  @IsIn(PRODUCT_SORTS)
  sort?: ProductSort;

  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 12, default: 12, minimum: 1, maximum: 48 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(48)
  limit?: number;

  @ApiPropertyOptional({
    type: [String],
    example: ['use_case:travel', 'noise_cancellation:true'],
    description:
      'Repeatable key:value filters. Values for the same key are OR. Different keys are AND.',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => toStringArray(value))
  @IsArray()
  @IsString({ each: true })
  @Validate(AttributeFilterConstraint, { each: true })
  attribute?: string[];
}

export function isAttributeFilter(value: string): boolean {
  const separator = value.indexOf(':');
  if (separator <= 0) {
    return false;
  }

  const key = value.slice(0, separator);
  const raw = value.slice(separator + 1);
  return /^[a-z][a-z0-9_]*$/.test(key) && raw.length > 0 && raw.length <= 80;
}

function toStringArray(value: unknown): unknown {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
}

function parseQueryBoolean(value: unknown): unknown {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  return value;
}
