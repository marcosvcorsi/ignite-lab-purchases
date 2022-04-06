import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import slugify from 'slugify';

type CreateProductParams = {
  title: string;
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async create({ title }: CreateProductParams): Promise<Product> {
    const slug = slugify(title, { lower: true });

    const existingProduct = await this.prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (existingProduct) {
      throw new Error('Product already exists');
    }

    return this.prisma.product.create({
      data: {
        title,
        slug,
      },
    });
  }
}
