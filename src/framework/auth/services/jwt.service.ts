import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ErrorResponse } from '@framework/errors/error-response';
import { ErrorReason } from '@framework/errors/error-reason';
import { Request } from 'express';

export type JWTPayload = {
  sessionId: string;
};

@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        new ErrorResponse(
          'JWT não informado.',
          401,
          ErrorReason.AUTHENTICATION,
        ),
      );
    }
    return token;
  }

  verifyToken(request: Request): JWTPayload {
    const token = this.extractTokenFromHeader(request);

    try {
      return this.nestJwtService.verify(token, {
        secret: this.getDecodedSecret(),
      });
    } catch (e) {
      throw new UnauthorizedException(
        new ErrorResponse(
          'Invalid JWT',
          401,
          ErrorReason.AUTHENTICATION,
          'INVALID_JWT',
        ),
      );
    }
  }

  public sign(payload: JWTPayload): string {
    return this.nestJwtService.sign(payload, {
      secret: this.getDecodedSecret(),
    });
  }

  private getDecodedSecret(): string {
    const encodedSecret = this.configService.getOrThrow('app.jwt.secret');
    return Buffer.from(encodedSecret, 'base64').toString('utf-8');
  }
}
