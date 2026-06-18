import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    firm: {
      create: jest.fn(),
    },
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: 'test@test.com', password: 'wrong' }))
      .rejects.toThrow(UnauthorizedException);
  });

  it('should return token on valid login', async () => {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('demo123456', 12);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1', email: 'demo@test.com', passwordHash: hash, firstName: 'Test', lastName: 'User', firmId: 'f1',
    });

    const result = await service.login({ email: 'demo@test.com', password: 'demo123456' });
    expect(result.accessToken).toBe('test-token');
  });
});
