import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function AtLeastOneField(
  propertyNames: (keyof any)[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneField',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          return propertyNames.some((prop) => args.object[prop] !== undefined);
        },
        defaultMessage() {
          return `At least one of ${propertyNames.join(', ')} must be provided`;
        },
      },
    });
  };
}
