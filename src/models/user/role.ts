import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

interface RoleAttributes {
  id: string;
  name: string;
}

/*
  We have to declare the AuthorCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {}

export interface RoleInstance
  extends Model<RoleAttributes, RoleCreationAttributes>,
    RoleAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<RoleInstance>("roles", {
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
    },
  });
};
