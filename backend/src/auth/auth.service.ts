import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Bu e-posta adresi zaten kayıtlı');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const firm = await this.prisma.firm.create({
      data: {
        name: dto.firmName,
        phone: dto.phone || '',
        city: dto.city || '',
        state: dto.state || '',
        address: '',
        zipCode: '',
        totalWorkbenches: 2,
        timezone: 'Europe/Istanbul',
      },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'owner',
        firmId: firm.id,
      },
    });

    const token = this.jwtService.sign({ userId: user.id, firmId: firm.id });
    return { accessToken: token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Geçersiz kimlik bilgileri');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Geçersiz kimlik bilgileri');

    const token = this.jwtService.sign({ userId: user.id, firmId: user.firmId });
    return { accessToken: token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, firmId: true },
    });
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');
    return user;
  }
}
