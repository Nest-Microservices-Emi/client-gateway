import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query, ParseEnumPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { OrderStatus } from './enum/order.enum';
import { NATS_SERVICE } from '../config/services';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.client.send({ cmd: 'createOrder' }, dto)
      .pipe(
        catchError( error => { throw new RpcException(error) })
      )
  }

  @Get()
  findAll(@Query() dto: OrderPaginationDto) {
    return this.client.send({ cmd: 'findAllOrders'}, dto)
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

  @Get(':id') 
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'findOrderById' }, { id })
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus
  ) {
    return this.client.send({ cmd: 'updateOrderStatus' }, { id, status })
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

}
