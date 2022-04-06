import { Injectable } from '@nestjs/common';
import { PurchaseStatus } from '@prisma/client';
import { AuthUser } from 'src/http/auth/current-user';
import { PrismaService } from '../database/prisma/prisma.service';

type CreatePurchaseParams = {
  productId: string;
  user: AuthUser;
};

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.purchase.findMany({
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

    return this.prisma.purchase.create({
      data: {
        status: PurchaseStatus.PENDING,
        customerId: customer.id,
        productId,
      },
    });
  }
}
