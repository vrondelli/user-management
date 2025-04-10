import { CryptoService } from '@domain/services/crypto.service';
import { UserService } from '@domain/services/user/user.service';
import {
  CommandActions,
  CommandResponse,
} from '@framework/responses/command.response';
import { CommandUseCase } from '@framework/use-cases/command.use-case';
import { Injectable } from '@nestjs/common';
import { User } from '@domain/entities/user/user.entity';

export type CreateUserParams = {
  email: string;
  password: string;
  name: string;
  role: string;
  organizationId: string;
  creatorUserId: string;
};

export type CreateUserPayload = { id: string };
export type CreateUserResponse = CommandResponse<CreateUserPayload>;

@Injectable()
export class CreateUser extends CommandUseCase<
  CreateUserParams,
  CreateUserPayload
> {
  static entity = User.name;
  static action = CommandActions.CREATE;

  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
  ) {
    super(CreateUser);
  }

  async execute(data: CreateUserParams): Promise<CreateUserResponse> {
    this.logger.debug('Executing create user use case', data);

    await this.userService.validateUserExistsByEmail(data.email);
    const role = await this.userService.validateUserCanAssignRole(
      data.creatorUserId,
      data.role,
    );
    const hashedPassword = await this.cryptoService.hashPassword(data.password);
    const newUser = await this.userService.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      organizationId: data.organizationId,
      role,
    });

    return this.respondWithSuccess({ id: newUser.id });
  }
}
