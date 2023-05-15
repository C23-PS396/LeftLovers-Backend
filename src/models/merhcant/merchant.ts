import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

interface MerchantAttributes {
  id: string;
  name: string;
  locationId: string;
  sellerId: string;
  profilePictureUrl?: string;
}

interface MerchantCreationalAttributes
  extends Optional<MerchantAttributes, "id"> {}

interface MerchantInstance
  extends Model<MerchantAttributes, MerchantCreationalAttributes>,
    MerchantAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<MerchantInstance>("merchants", {
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
      unique: true,
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        key: "id",
        model: "locations",
      },
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        key: "id",
        model: "sellers",
      },
    },
    profilePictureUrl: {
      type: DataTypes.STRING,
    },
  });
};
