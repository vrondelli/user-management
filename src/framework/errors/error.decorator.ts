export const ERROR_DECORATOR = 'errorDecorator';
export const ErrorDecorator =
  ({ name }: { name: string }) =>
  (target: Function) => {
    Reflect.defineMetadata(ERROR_DECORATOR, name, target);
  };
