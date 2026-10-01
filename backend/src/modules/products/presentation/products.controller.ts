import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SearchProductsQueryDto } from '../application/dto/search-products.query.js';
import {
  PaginatedProductsDto,
  ProductDetailDto,
} from '../application/dto/product-response.dto.js';
import { GetProductUseCase } from '../application/use-cases/get-product.use-case.js';
import { SearchProductsUseCase } from '../application/use-cases/search-products.use-case.js';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly searchProducts: SearchProductsUseCase,
    private readonly getProduct: GetProductUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Search, filter, and sort products' })
  @ApiOkResponse({ type: PaginatedProductsDto })
  search(@Query() query: SearchProductsQueryDto): Promise<PaginatedProductsDto> {
    return this.searchProducts.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: ProductDetailDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  get(@Param('id', ParseUUIDPipe) id: string): Promise<ProductDetailDto> {
    return this.getProduct.execute(id);
  }
}
