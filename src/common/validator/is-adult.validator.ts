import {
    registerDecorator,
    ValidationOptions
} from 'class-validator';

export function IsAdult(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsAdult',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Date) {
          if (!value) return false;
          const today = new Date();
          const age = today.getFullYear() - value.getFullYear();
          return age >= 18;
        },
        defaultMessage() {
          return 'Age must be at least 18 years old';
        },
      },
    });
  };
}
