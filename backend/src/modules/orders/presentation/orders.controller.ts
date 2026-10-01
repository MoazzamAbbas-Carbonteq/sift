import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
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
import { OrderResponseDto } from '../application/dto/order-response.dto.js';
import { PlaceOrderDto } from '../application/dto/place-order.dto.js';
import { GetOrderUseCase } from '../application/use-cases/get-order.use-case.js';
import { ListOrdersUseCase } from '../application/use-cases/list-orders.use-case.js';
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case.js';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly placeOrder: PlaceOrderUseCase,
    private readonly listOrders: ListOrdersUseCase,
    private readonly getOrder: GetOrderUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Place an order from the demo user active cart' })
  @ApiCreatedResponse({ type: OrderResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid shipping details or empty cart' })
  @ApiConflictResponse({ description: 'A cart item is out of stock' })
  @ApiNotFoundResponse({ description: 'Active cart not found' })
  place(@Body() body: PlaceOrderDto): Promise<OrderResponseDto> {
    return this.placeOrder.execute(body);
  }

  @Get()
  @ApiOperation({ summary: 'List the demo user orders' })
  @ApiOkResponse({ type: OrderResponseDto, isArray: true })
  list(): Promise<OrderResponseDto[]> {
    return this.listOrders.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one demo user order' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: OrderResponseDto })
  @ApiNotFoundResponse({ description: 'Order not found' })
  get(@Param('id', ParseUUIDPipe) id: string): Promise<OrderResponseDto> {
    return this.getOrder.execute(id);
  }
}
