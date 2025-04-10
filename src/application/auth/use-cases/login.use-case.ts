import { Injectable } from '@nestjs/common';
import { UserService } from '@domain/services/user/user.service';
import { CryptoService } from '@domain/services/crypto.service';
import { JwtService } from '@framework/auth/services/jwt.service';
import { CommandUseCase } from '@framework/use-cases/command.use-case';
import {
  CommandActions,
  CommandResponse,
} from '@framework/responses/command.response';
import { InvalidCredentialsError } from '@domain/error/auth.error';
import { SessionService } from '@domain/services/session/session.service';
import { User } from '@domain/entities/user/user.entity';
import { UserNotFoundByEmailError } from '@domain/error/user.error';

export type RequestInfo = {
  ip?: string;
  userAgent?: string;
  device?: string;
};

export type LoginParams = {
  requestInfo?: RequestInfo;
  email: string;
  password: string;
};

export type LoginPayload = {
  accessToken: string;
};

export type LoginResponse = CommandResponse<LoginPayload>;

@Injectable()
export class Login extends CommandUseCase<LoginParams, LoginPayload> {
  static entity = 'Login';
  static action = CommandActions.CREATE;

  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {
    super(Login);
  }

  async execute(params: LoginParams): Promise<LoginResponse> {
    const user = await this.getUser(params.email);
    await this.validatePassword(params.password, user);
    const session = await this.sessionService.createSession(
      user,
      params.requestInfo,
    );

    const payload = {
      sessionId: session.id,
    };

    const accessToken = this.jwtService.sign(payload);

    return this.respondWithSuccess({ accessToken });
  }

  private async getUser(email: string): Promise<User> {
    const user = await this.userService
      .getUserByEmail(email, { group: true })
      .catch((error) => {
        if (error instanceof UserNotFoundByEmailError) {
          return null;
        }
        throw error;
      });

    if (!user) {
      throw new InvalidCredentialsError();
    }
    return user;
  }

  private async validatePassword(password: string, user: User): Promise<void> {
    const isPasswordValid = await this.cryptoService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }
  }
}
