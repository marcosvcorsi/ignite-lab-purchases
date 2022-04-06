import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { CustomersService } from 'src/services/customers.service';
import { ProductsService } from 'src/services/products.service';
import { PurchasesService } from 'src/services/purchases.service';
import { Product } from '../schema/product';
import { CreatePurchaseInput, Purchase } from '../schema/purchase';

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

  @UseGuards(AuthorizationGuard)
  @Mutation(() => Purchase)
  async createPurchase(
    @Args('input') { productId }: CreatePurchaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.purchasesService.create({
      productId,
      user,
    });
  }
}
