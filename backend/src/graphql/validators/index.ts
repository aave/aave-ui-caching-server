import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { isAddress } from 'ethers/lib/utils';

export function IsEthAddress(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      propertyName,
      name: 'isEthAddress',
      target: object.constructor,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return isAddress(value);
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return 'Is not valid Ethereum address';
        },
      },
    });
  };
}
