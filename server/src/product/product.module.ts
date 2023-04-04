import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { PrismaService } from '../prisma.service'
import { PaginationService } from '../pagination/pagination.service'
import { CategoryService } from '../category/category.service'

@Module({
	controllers: [ProductController],
	providers: [ProductService, PrismaService, CategoryService, PaginationService],
	exports: [ProductService]
})
export class ProductModule {
}
