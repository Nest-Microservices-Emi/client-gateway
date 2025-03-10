import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto } from '../dto/create-product.dto';
import { NATS_SERVICE, PRODUCT_SERVICE } from '../../config/services';
import { PaginationDto } from '../../common/pagination.dto';
import { UpdateProductDto } from '../dto/update-product.dto';


@Controller('products')
export class ProductsController {
  constructor(
    // @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Post()
  public async create(@Body() dto: CreateProductDto) {
    return this.client.send({ cmd: 'createProduct'}, dto)
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

  @Get()
  public async findAll(@Query() dto: PaginationDto) {
    return this.client.send({ cmd: 'findAllProducts'}, dto)
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

  @Get(':id')
  public async findById(@Param('id') id: string) {
    return this.client.send({ cmd: 'findProductById' }, { id })
      .pipe(
        catchError( error => { throw new RpcException(error) })
      );
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.client.send({ cmd: 'removeProduct' }, { id })
        .pipe(
          catchError( error => { throw new RpcException(error) })
        );
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto
  ) {
    return this.client.send({ cmd: 'updateProduct' }, { id, ...dto })
      .pipe(
        catchError( error => { throw new RpcException(error)})
      );
  }
}
