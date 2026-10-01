import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AddCartItemDto, UpdateCartItemDto } from '../application/dto/cart-item.dto.js';
import { CartResponseDto } from '../application/dto/cart-response.dto.js';
import { AddCartItemUseCase } from '../application/use-cases/add-cart-item.use-case.js';
import { GetCartUseCase } from '../application/use-cases/get-cart.use-case.js';
import { RemoveCartItemUseCase } from '../application/use-cases/remove-cart-item.use-case.js';
import { UpdateCartItemUseCase } from '../application/use-cases/update-cart-item.use-case.js';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(
    private readonly getCart: GetCartUseCase,
    private readonly addCartItem: AddCartItemUseCase,
    private readonly updateCartItem: UpdateCartItemUseCase,
    private readonly removeCartItem: RemoveCartItemUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get the demo user active cart' })
  @ApiOkResponse({ type: CartResponseDto })
  @ApiNotFoundResponse({ description: 'Active cart not found' })
  get(): Promise<CartResponseDto> {
    return this.getCart.execute();
  }

  @Post('items')
  @ApiOperation({ summary: 'Add a product to the active cart' })
  @ApiCreatedResponse({ type: CartResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid quantity' })
  @ApiNotFoundResponse({ description: 'Product or active cart not found' })
  @ApiConflictResponse({ description: 'Product is out of stock' })
  add(@Body() body: AddCartItemDto): Promise<CartResponseDto> {
    return this.addCartItem.execute(body);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update a cart line quantity' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CartResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid quantity' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  @ApiConflictResponse({ description: 'Product is out of stock' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.updateCartItem.execute(id, body);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove a cart line' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: CartResponseDto })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<CartResponseDto> {
    return this.removeCartItem.execute(id);
  }
}
