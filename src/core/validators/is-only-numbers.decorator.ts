// validators/is-only-numbers.decorator.ts
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

interface IsOnlyNumbersOptions {
  allowEmpty?: boolean;    // Permitir string vacío
  minLength?: number;      // Longitud mínima
  maxLength?: number;      // Longitud máxima
  exactLength?: number;    // Longitud exacta
}

export function IsOnlyNumbers(
  options: IsOnlyNumbersOptions = {},
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isOnlyNumbers',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value === undefined || value === null) return false;
          
          // Validar tipo string
          if (typeof value !== 'string') return false;
          
          // Validar vacío
          if (value.length === 0) {
            return options.allowEmpty === true;
          }
          
          // Validar que solo contenga números
          if (!/^\d+$/.test(value)) return false;
          
          // Validar longitud mínima
          if (options.minLength && value.length < options.minLength) return false;
          
          // Validar longitud máxima
          if (options.maxLength && value.length > options.maxLength) return false;
          
          // Validar longitud exacta
          if (options.exactLength && value.length !== options.exactLength) return false;
          
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          let message = `${args.property} debe contener solo números (0-9)`;
          if (options.minLength) message += ` y tener al menos ${options.minLength} caracteres`;
          if (options.maxLength) message += ` y máximo ${options.maxLength} caracteres`;
          if (options.exactLength) message += ` y tener exactamente ${options.exactLength} caracteres`;
          if (options.allowEmpty) message += ` (puede estar vacío)`;
          return message;
        },
      },
    });
  };
}