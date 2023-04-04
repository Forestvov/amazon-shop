import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { generateSlug } from '../utils/generate-slug'
import { returnProductObject, returnProductObjectFullest } from './return-product.object'
import { ProductDto } from './dto/product.dto'
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto'
import { PaginationService } from '../pagination/pagination.service'
import { Prisma } from '@prisma/client'
import { CategoryService } from '../category/category.service'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService, private categoryService: CategoryService, private paginationService: PaginationService) {
	}

	async getAll(dto: GetAllProductDto = {}) {
		const { sort, searchTerm } = dto

		const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

		if (sort === EnumProductSort.LOW_PRICE) {
			prismaSort.push({ price: 'asc' })
		} else if (sort === EnumProductSort.HIGH_PRICE) {
			prismaSort.push({ price: 'desc' })
		} else if (sort === EnumProductSort.OLDEST) {
			prismaSort.push({ createdAt: 'asc' })
		} else {
			prismaSort.push({ createdAt: 'desc' })
		}

		const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm ? {
			OR: [
				{
					category: {
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				},
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					description: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		} : {}

		const { perPage, skip } = this.paginationService.getPagination(dto)

		const products = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage
		})

		return {
			products,
			length: await this.prisma.product.count({
				where: prismaSearchTermFilter
			})
		}
	}

	async byId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			select: {
				...returnProductObjectFullest
			}
		})

		if (!product) {
			throw new NotFoundException('Product not Found')
		}

		return product
	}

	async bySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: { slug },
			select: {
				...returnProductObjectFullest
			}
		})

		if (!product) {
			throw new NotFoundException('Product not Found')
		}

		return product
	}

	async byCategory(categorySlug: string) {
		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: {
				...returnProductObjectFullest
			}
		})

		if (!products) {
			throw new NotFoundException('Products not Found')
		}

		return products
	}

	async getSimilar(id: number) {
		const currentProduct = await this.byId(id)

		if (!currentProduct) {
			throw new NotFoundException('Current product not found')
		}

		return this.prisma.product.findMany({
			where: {
				category: {
					name: currentProduct.category.name
				},
				NOT: {
					id: currentProduct.id
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			select: returnProductObject
		})
	}


	async create() {
		const product = await this.prisma.product.create({
			data: {
				name: '',
				description: '',
				price: 0,
				slug: ''
			}
		})

		return product.id
	}

	async update(id: number, dto: ProductDto) {
		const { description, price, name, images, categoryId } = dto

		const category = await this.categoryService.byId(categoryId)

		if (!category) {
			throw new NotFoundException('Category product not found')
		}

		return this.prisma.product.update({
			where: { id },
			data: {
				name,
				images,
				price,
				description,
				slug: generateSlug(name),
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		})
	}

	async remove(id: number) {
		return this.prisma.product.delete({
			where: { id }
		})
	}
}
