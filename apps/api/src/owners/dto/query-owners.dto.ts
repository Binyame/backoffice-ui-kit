import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class QueryOwnersDto {
  @IsOptional()
  @IsNumberString({}, { message: 'Page must be a number' })
  page?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Page size must be a number' })
  pageSize?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
