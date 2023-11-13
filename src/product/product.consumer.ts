import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ProductService } from './product.service';
import { Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Constants } from 'src/util/constants';

@Processor(Constants.PRODUCT_QUEUE)
export class ProductConsumer {
  constructor(private productService: ProductService) {}

  @Process(Constants.PRODUCT_CREATE_JOB)
  create(job: Job<CreateProductDto>) {
    return this.productService
      .createProduct(job.data)
      .then((product) =>
        Logger.log(`Job ${job.id} completed: Product ${product.id} created`),
      )
      .catch((err) =>
        Logger.error(`Job ${job.id} failed with error: ${err.message}`),
      );
  }
}
