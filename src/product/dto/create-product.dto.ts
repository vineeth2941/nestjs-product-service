import { IsNotEmpty, IsInt, Min, IsString } from 'class-validator';
import { ProductCategory } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsNotEmpty()
  category: ProductCategory;

  @Transform(({ value }) => value === true)
  active: boolean;
}
