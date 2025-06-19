import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @IsNumber()
  @IsPositive()
  mealId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  restaurantId: number;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsNumber()
  deliveryLatitude: number;

  @IsNumber()
  deliveryLongitude: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
