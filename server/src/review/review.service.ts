import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { returnReviewObject } from './return-review.object'
import { ReviewDto } from './review.dto'
import { ProductService } from '../product/product.service'

@Injectable()
export class ReviewService {
	constructor(private prisma: PrismaService, private productService: ProductService) {
	}

	async getAll() {
		return this.prisma.review.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			select: returnReviewObject
		})
	}

	async create(userId: number, dto: ReviewDto, productId: number) {
		const product = await this.productService.byId(productId)

		if(!product) {
			throw new NotFoundException('Product not Found')
		}

		return this.prisma.review.create({
			data: {
				...dto,
				product: {
					connect: {
						id: productId
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async getAverageValueByProductId(productId: number) {
		return this.prisma.review.aggregate({
			where: { productId },
			_avg: { rating: true }
		})
			.then(data => data._avg)
	}
}
