import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

interface FoodAttributes {
  id: string;
  name: string;
  price: number;
  merchantId: string;
  pictureUrl?: string;
}

interface FoodCreationalAttributes extends Optional<FoodAttributes, "id"> {}

export interface FoodInstance
  extends Model<FoodAttributes, FoodCreationalAttributes>,
    FoodAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<FoodInstance>("foods", {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: () => uuidv4(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pictureUrl: {
      type: DataTypes.STRING,
    },
    merchantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        key: "id",
        model: "merchants",
      },
    },
  });
};
