import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

interface FoodCategoryAttributes {
  id: string;
  foodId: string;
  categoryId: string;
}

interface FoodCategoryCreationnalAttributes
  extends Optional<FoodCategoryAttributes, "id"> {}

interface FoodCategoryInstance
  extends Model<FoodCategoryAttributes, FoodCategoryCreationnalAttributes>,
    FoodCategoryAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<FoodCategoryInstance>("foodCategories", {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: () => uuidv4(),
    },
    foodId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        key: "id",
        model: "foods",
      },
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        key: "id",
        model: "categories",
      },
    },
  });
};
