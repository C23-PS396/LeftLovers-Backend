import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

interface LocationAttributes {
  id: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  fullLocation: string;
}

interface LocationCreationalAttributes
  extends Optional<LocationAttributes, "id"> {}

interface LocationInstance
  extends Model<LocationAttributes, LocationCreationalAttributes>,
    LocationAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<LocationInstance>("locations", {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: () => uuidv4(),
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    village: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
