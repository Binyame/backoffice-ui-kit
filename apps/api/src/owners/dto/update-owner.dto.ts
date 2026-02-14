import { IsEmail, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { OwnerRole } from '@backoffice-kit/shared';

export class UpdateOwnerDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Ownership percentage must be a number' })
  @Min(0, { message: 'Ownership percentage must be at least 0' })
  @Max(100, { message: 'Ownership percentage cannot exceed 100' })
  ownershipPercentage?: number;

  @IsOptional()
  @IsEnum(OwnerRole, { message: 'Invalid role' })
  role?: OwnerRole;
}
