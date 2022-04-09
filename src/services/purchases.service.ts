import { Injectable } from '@nestjs/common';
import { PurchaseStatus } from '@prisma/client';
import { AuthUser } from 'src/http/auth/current-user';
import { KafkaService } from 'src/messaging/kafka.service';
import { PrismaService } from '../database/prisma/prisma.service';

type CreatePurchaseParams = {
  productId: string;
  user: AuthUser;
};

@Injectable()
export class PurchasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaService: KafkaService,
  ) {}

  async findAll() {
    return this.prisma.purchase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByCustomerId(customerId: string) {
    return this.prisma.purchase.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create({ user, productId }: CreatePurchaseParams) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    let customer = await this.prisma.customer.findUnique({
      where: {
        authUserId: user.sub,
      },
    });

    if (!customer) {
      customer = await this.prisma.customer.create({
        data: {
          authUserId: user.sub,
        },
      });
    }

    const purchase = await this.prisma.purchase.create({
      data: {
        status: PurchaseStatus.PENDING,
        customerId: customer.id,
        productId,
      },
    });

    this.kafkaService.emit('purchases.purchase-created', {
      customer: {
        authUserId: customer.authUserId,
      },
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
      },
    });

    return purchase;
  }
}
