import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { BullModule } from '@nestjs/bull';
import { Constants } from 'src/util/constants';
import { ProductConsumer } from './product.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: Constants.PRODUCT_QUEUE,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductConsumer],
})
export class ProductModule {}
