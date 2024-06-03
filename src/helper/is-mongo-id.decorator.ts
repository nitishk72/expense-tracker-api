import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ async: false })
export class IsMongoIdConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return Types.ObjectId.isValid(value); // Check if the value is a valid MongoDB ObjectId
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid MongoDB ObjectId';
  }
}

export function IsMongoId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMongoIdConstraint,
    });
  };
}