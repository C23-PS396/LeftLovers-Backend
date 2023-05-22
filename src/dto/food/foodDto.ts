export interface FoodDto {
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

export interface FoodTransaction {
  merchantId: string;
  customerId: string;
  foods: { foodId: string; quantity: number }[];
}
