import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;
}

@InputType()
export class CreateProductInput {
  @Field()
  title: string;
}
