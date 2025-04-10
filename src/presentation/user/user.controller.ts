import { Body, Controller, Post } from '@nestjs/common';
import { ApiCommandUseCaseOkResponse } from '@framework/doc/api-ok-command-response.decorator';
import { ApiErrorResponses } from '@framework/doc/api-error-response.decorator';
import { CreateUser } from '@application/user/use-cases/create-user/create-user.use-case';

import { ApiOperation } from '@nestjs/swagger';
import { CreateUserResponse } from './responses/create-user.response';
import CreateUserValidator from './validators/create-user.validator';
import { UseAuthGuard } from '@framework/auth/guards/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDataPipeFactory } from '@framework/auth/pipes/auth-user-data.pipe';
import { Login } from '@application/auth/use-cases/login.use-case';
import { LoginResponse } from './responses/login.response';
import { LoginDto } from './dto/login.dto';
import loginValidator from './validators/login.validator';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly loginUseCase: Login,
  ) {}

  @Post()
  @UseAuthGuard('user-management.basic.createUser')
  @ApiCommandUseCaseOkResponse(CreateUser, CreateUserResponse)
  @ApiOperation({
    summary: 'Create a new user.',
    description:
      'The user being created must have fewer or equal permissions than the logged-in user. This is enforced using wildcard-compatible RBAC permission matching.',
  })
  @ApiErrorResponses()
  async create(
    @Body(
      CreateUserValidator,
      AuthDataPipeFactory({
        userId: 'creatorUserId',
        organizationId: 'organizationId',
      }),
    )
    body: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return this.createUser.execute(body);
  }

  @Post('login')
  @ApiCommandUseCaseOkResponse(Login, LoginResponse)
  @ApiOperation({
    summary: 'Authenticate a user and return an access token.',
    description:
      'This endpoint allows users to log in by providing their email and password. A valid JWT token is returned upon successful authentication.',
  })
  @ApiErrorResponses()
  async login(@Body(loginValidator) body: LoginDto): Promise<LoginResponse> {
    return this.loginUseCase.execute(body);
  }
}
