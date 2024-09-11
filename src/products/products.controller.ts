import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { PRODUCT_SERVICE } from '../config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ProductPaginationDto } from '../common/pagination.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto } from '../common/create-product.dto';
import { UpdateProductDto } from '../common/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) {}

  @Post()
  public async create(@Body() dto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create'}, dto)
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

  @Get()
  public async findAll(@Query() dto: ProductPaginationDto) {
    return this.productsClient.send({ cmd: 'findAll'}, dto)
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

  @Get(':id')
  public async findById(@Param('id') id: string) {
    // try {
      return this.productsClient.send({ cmd: 'findById' }, { id })
        .pipe(
          catchError( error => { throw new RpcException(error) })
        );
      // return await firstValueFrom(request);
    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'remove' }, { id })
        .pipe(
          catchError( error => { throw new RpcException(error) })
        );
  }

  @Patch(':id')
  public async update(@Body() dto: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'update' }, dto)
      .pipe(
        catchError( error => { throw new RpcException(error)})
      );
  }
}
