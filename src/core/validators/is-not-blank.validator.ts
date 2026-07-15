// validators/is-not-blank.validator.ts
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNotBlank(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotBlank',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          // Retorna true solo si es string y después de limpiar espacios no está vacío
          return typeof value === 'string' && value.trim().length > 0;
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} no puede estar vacío o contener solo espacios`;
        },
      },
    });
  };
}