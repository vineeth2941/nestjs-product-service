import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, Prisma } from '@prisma/client';
import { ParseValuePipe } from '../util/parse-value.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Constants } from 'src/util/constants';

@Controller('/products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @InjectQueue(Constants.PRODUCT_QUEUE) private productQueue: Queue,
  ) {}

  @Get()
  getProducts(
    @Query('filters', ParseValuePipe) filters: Prisma.ProductWhereInput,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Product[]> {
    return this.productService.getProducts(filters, offset, limit);
  }

  @Post()
  createProduct(@Body() product: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(product);
  }

  @Get('/:id')
  getProduct(@Param('id') id: number): Promise<Product> {
    return this.productService.getProduct(id);
  }

  @Put('/:id')
  updateProduct(
    @Param('id') id: number,
    @Body() product: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, product);
  }

  @Post('/batch')
  @HttpCode(200)
  @UseInterceptors(AnyFilesInterceptor())
  createProductsBatch(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .addMaxSizeValidator({ maxSize: 10240 })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        }),
    )
    files: Array<Express.Multer.File>,
  ): Promise<string> {
    const file = files[0];
    const products: Array<CreateProductDto> = JSON.parse(
      file.buffer.toString(),
    );
    return this.productQueue
      .addBulk(
        products.map((data) => ({
          name: Constants.PRODUCT_CREATE_JOB,
          data,
        })),
      )
      .then(() => '');
  }
}
