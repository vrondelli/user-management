import { PipeTransform, Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { type AuthExpressRequest } from '../guards/auth.guard';
import { AuthUserData } from '@framework/types/auth-user-data';

/**
 * AuthUserDataPipe is a NestJS pipe that merges user authentication data
 * from the request into the value passed to it.
 *
 * @param keys - An array of keys to pick from the user authentication data.
 * @returns A NestJS PipeTransform implementation that merges user auth data.
 */

type AuthUserDataKeys = keyof AuthUserData;
export const AuthDataPipeFactory = (
  mapper?: Partial<Record<AuthUserDataKeys, string>>,
) => {
  @Injectable()
  class AuthUserDataPipe implements PipeTransform {
    constructor(@Inject(REQUEST) public readonly request: AuthExpressRequest) {}

    transform(value: any) {
      const userAuthData = this.request.authUserData;
      if (!mapper) {
        return { ...value, ...userAuthData };
      }
      const pickedData = Object.entries(mapper).reduce((acc, [key, newKey]) => {
        if (userAuthData[key] !== undefined) {
          acc[newKey] = userAuthData[key];
        }
        return acc;
      }, {} as Partial<AuthUserData>);

      return {
        ...value,
        ...pickedData,
      };
    }
  }

  return AuthUserDataPipe;
};
