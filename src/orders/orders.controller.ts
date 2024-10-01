import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query, ParseEnumPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { OrderStatus } from './enum/order.enum';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy
  ) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersClient.send({ cmd: 'create' }, dto)
      .pipe(
        catchError( error => { throw new RpcException(error) })
      )
  }

  @Get()
  findAll(@Query() dto: OrderPaginationDto) {
    return this.ordersClient.send({ cmd: 'findAll'}, dto)
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

  @Get(':id') 
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send({ cmd: 'findById' }, { id })
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus
  ) {
    return this.ordersClient.send({ cmd: 'updateStatus' }, { id, status })
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

}
