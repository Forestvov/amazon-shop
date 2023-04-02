import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AuthDto } from './auth.dto'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}
	async register(dto: AuthDto) {
			const oldUser = await this.prisma.user.findUnique({
				where: {
					email: dto.email
				}
			})

		if(oldUser) throw new BadRequestException('User already exists')
	}
}
