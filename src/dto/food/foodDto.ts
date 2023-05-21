export interface FoodDto {
  [x: string]: any;
  name: string;
  price: number;
  pictureUrl: string;
  category: string[];
}

export interface ActiveFoodDto {
  foodId: string;
  stock: number;
  durationInHour: number;
  isActive?: boolean;
}
