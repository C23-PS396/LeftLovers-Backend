import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

interface CategoryAttributes {
  id: string;
  name: string;
}

interface CategoryCreationalAttribute
  extends Optional<CategoryAttributes, "id"> {}

interface CategoryInstance
  extends Model<CategoryAttributes, CategoryCreationalAttribute>,
    CategoryAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<CategoryInstance>("categories", {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: () => uuidv4(),
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  });
};
