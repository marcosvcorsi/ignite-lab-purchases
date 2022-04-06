import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { ProductsService } from '../../../services/products.service';
import { CreateProductInput, Product } from '../schema/product';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productService: ProductsService) {}

  @Query(() => [Product])
  async products() {
    return this.productService.findAll();
  }

  @UseGuards(AuthorizationGuard)
  @Mutation(() => Product)
  async createProduct(@Args('input') input: CreateProductInput) {
    return this.productService.create(input);
  }
}
