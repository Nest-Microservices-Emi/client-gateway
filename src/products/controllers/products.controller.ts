import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto } from '../dto/create-product.dto';
import { PRODUCT_SERVICE } from '../../config/services';
import { PaginationDto } from '../../common/pagination.dto';
import { UpdateProductDto } from '../dto/update-product.dto';


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
  public async findAll(@Query() dto: PaginationDto) {
    return this.productsClient.send({ cmd: 'findAll'}, dto)
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

  @Get(':id')
  public async findById(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'findById' }, { id })
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'remove' }, { id })
        .pipe(
          catchError( error => { throw new RpcException(error) })
        );
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto
  ) {
    return this.productsClient.send({ cmd: 'update' }, { id, ...dto })
      .pipe(
        catchError( error => { throw new RpcException(error)})
      );
  }
}
