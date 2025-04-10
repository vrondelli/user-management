import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../services/jwt.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IS_API_KEY } from '../decorators/api-key.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public-api.decorator';
import { Request } from 'express';
import {
  REQUIRED_PERMISSIONS_KEY,
  RequirePermission,
} from '../decorators/required-permission.decorator';
import { AuthProvider } from '../providers/auth-user.provider';
import { PermissionCheckerService } from '../services/permission-checker.service';
import { ErrorResponse } from '@framework/errors/error-response';
import { ErrorReason } from '@framework/errors/error-reason';
import { AuthUserData } from '@framework/types/auth-user-data';

export type AuthExpressRequest = Request & {
  authUserData: AuthUserData;
};

/**
 * @class AuthGuard
 * @implements {CanActivate}
 * @description A guard that handles authentication and authorization for incoming requests.
 * It supports multiple strategies such as public, API key, and JWT-based authentication.
 *
 * ### Strategies:
 * 1. **Public Authorization Strategy**:
 *    - Allows unrestricted access to endpoints marked as public using the `@Public()` decorator.
 *    - Returns `true` immediately, bypassing further checks.
 *
 * 2. **API Key Authorization Strategy**:
 *    - Validates the `x-api-key` header against the configured API key secret.
 *    - Ensures the request is authorized if the API key matches.
 *
 * 3. **JWT Authorization Strategy**:
 *    - Extracts and verifies the JWT token from the `Authorization` header.
 *    - Retrieves user session data using the `AuthProvider` service.
 *    - Validates user permissions against the required permissions for the endpoint.
 *    - Throws an `UnauthorizedException` if the token is invalid or the user lacks permissions.
 *
 * @example
 * // Usage in a controller
 * @UseGuards(AuthGuard)
 * @Controller('example')
 * export class ExampleController {}
 *
 * @constructor
 * @param {JwtService} jwtService - Service for handling JWT operations.
 * @param {Reflector} reflector - Service for retrieving metadata set by decorators.
 * @param {ConfigService} configService - Service for accessing application configuration.
 * @param {AuthProvider} authProvider - Service for authorizing users based on session data.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly authProvider: AuthProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const strategy = this.getAuthorizationStrategy(context);

    if (strategy['public']) {
      return this.publicAuthorizationStrategy();
    }

    if (strategy['apiKey']) {
      return this.apiKeyAuthorizationStrategy(request);
    }

    return this.jwtAuthorizationStrategy(request, context);
  }

  extractFromHeader(
    request: Request<any, any, any, { authorization: string }>,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }

  private getAuthorizationStrategy(context: ExecutionContext): {
    public: boolean;
    apiKey: boolean;
    jwt: boolean;
  } {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isApiKey = this.reflector.getAllAndOverride<boolean>(IS_API_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return { public: isPublic, apiKey: isApiKey, jwt: !isPublic && !isApiKey };
  }

  private publicAuthorizationStrategy(): boolean {
    return true;
  }

  private apiKeyAuthorizationStrategy(request: any): boolean {
    const apiKey = request.headers['x-api-key'];
    return (
      apiKey && apiKey == this.configService.getOrThrow('app.apiKeySecret')
    );
  }

  private async validateUserPermissions(
    userPermissions: string[],
    context: ExecutionContext,
  ): Promise<void> {
    console.log('User permissions:', userPermissions);
    const requiredPermission = this.getRequiredPermission(context);
    if (!requiredPermission) {
      return;
    }
    console.log('Required permission:', requiredPermission);
    if (
      !PermissionCheckerService.hasRequiredPermission(
        userPermissions,
        requiredPermission,
      )
    ) {
      throw new ErrorResponse(
        'User does not have permission',
        403,
        ErrorReason.FORBIDDEN,
        'FORBIDDEN',
      );
    }
  }
  private async jwtAuthorizationStrategy(
    request: any,
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const { sessionId } = this.jwtService.verifyToken(request);
      const authUserData = await this.authProvider.authorize(sessionId);
      await this.validateUserPermissions(authUserData.permissions, context);
      request.authUserData = authUserData;
    } catch (e) {
      this.logger.error('Error in jwt authorize', e);
      throw e;
    }

    return true;
  }

  private getRequiredPermission(context: ExecutionContext): string {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      REQUIRED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    return requiredPermission;
  }
}

export const UseAuthGuard = (requiredPermission: string) =>
  applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    RequirePermission(requiredPermission),
  );
