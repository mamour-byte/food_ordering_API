import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsNumber()
  restaurantId: number;
  isAvailable: boolean;
}
