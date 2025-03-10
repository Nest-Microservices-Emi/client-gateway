import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE, PRODUCT_SERVICE } from '../config/services';
import { envs } from '../config/envs';
import { ProductsController } from './controllers/products.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [ NatsModule ],
  controllers: [ ProductsController ],
})
export class ProductsModule {}
