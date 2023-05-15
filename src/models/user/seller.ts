import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

interface SellerAttributes {
  id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  roleId: string;
}

/*
  We have to declare the AuthorCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface SellerCreationAttributes extends Optional<SellerAttributes, "id"> {}

interface SellerInstance
  extends Model<SellerAttributes, SellerCreationAttributes>,
    SellerAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<SellerInstance>("sellers", {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: () => uuidv4(),
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    },
  });
};
