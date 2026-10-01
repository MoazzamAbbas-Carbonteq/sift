import { ApiProperty } from '@nestjs/swagger';
import { ProductSummaryDto } from '../../../products/application/dto/product-response.dto.js';

export class DiscoveryMatchDto {
  @ApiProperty({ type: ProductSummaryDto })
  product: ProductSummaryDto;

  @ApiProperty({
    example: '60-hour battery. Price is $349.95, inside the $200+ budget.',
  })
  reason: string;
}

export class DiscoveryResponseDto {
  @ApiProperty({ type: [DiscoveryMatchDto] })
  matches: DiscoveryMatchDto[];
}
