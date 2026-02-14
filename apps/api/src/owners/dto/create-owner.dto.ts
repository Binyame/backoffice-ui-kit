import { IsEmail, IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { OwnerRole } from '@backoffice-kit/shared';

export class CreateOwnerDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNumber({}, { message: 'Ownership percentage must be a number' })
  @Min(0, { message: 'Ownership percentage must be at least 0' })
  @Max(100, { message: 'Ownership percentage cannot exceed 100' })
  ownershipPercentage: number;

  @IsEnum(OwnerRole, { message: 'Invalid role' })
  role: OwnerRole;
}
