import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import path from 'node:path';
import { ProductsResolver } from './graphql/resolvers/products.resolver';
import { DatabaseModule } from '../database/database.module';
import { ProductsService } from 'src/services/products.service';
import { PurchasesResolver } from './graphql/resolvers/purchases.resolver';
import { PurchasesService } from 'src/services/purchases.service';
import { CustomersService } from 'src/services/customers.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
    DatabaseModule,
  ],
  providers: [
    ProductsResolver,
    PurchasesResolver,
    ProductsService,
    PurchasesService,
    CustomersService,
  ],
})
export class HttpModule {}
