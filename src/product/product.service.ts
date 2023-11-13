import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from 'src/database/database.repository';
import { Product, Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private repository: DatabaseRepository) {}

  getProducts(
    filters: Prisma.ProductWhereInput = {},
    offset: number = 0,
    limit: number = 10,
  ): Promise<Product[]> {
    return this.repository.product.findMany({
      where: filters,
      skip: offset,
      take: limit,
    });
  }

  createProduct(product: CreateProductDto): Promise<Product> {
    return this.repository.product.create({ data: product });
  }

  getProduct(id: number): Promise<Product> {
    return this.repository.product.findUnique({ where: { id } });
  }

  updateProduct(id: number, product: UpdateProductDto): Promise<Product> {
    return this.repository.product.update({ data: product, where: { id } });
  }
}
