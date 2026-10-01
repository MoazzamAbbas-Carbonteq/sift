import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Headphones' })
  name: string;

  @ApiProperty({ example: 'headphones' })
  slug: string;
}
