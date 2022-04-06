import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProductsService } from 'src/services/products.service';
import { PurchasesService } from 'src/services/purchases.service';
import { Product } from '../schema/product';
import { Purchase } from '../schema/purchase';

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(
    private readonly purchasesService: PurchasesService,
    private readonly productsService: ProductsService,
  ) {}

  @Query(() => [Purchase])
  async purchases() {
    return this.purchasesService.findAll();
  }

  @ResolveField(() => Product)
  async product(@Parent() purchase: Purchase) {
    return this.productsService.findById(purchase.productId);
  }
}
