import { Sequelize } from "sequelize";
import {
  db_name,
  db_host,
  db_user,
  db_password,
  db_port,
} from "../../config/config";
import role from "./user/role";
import customer from "./user/customer";
import seller from "./user/seller";
import merhcant from "./merhcant/merchant";
import location from "./location/location";
import food from "./food/food";
import foodCategory from "./food/foodCategory";
import category from "./food/category";

const sequelize = new Sequelize(db_name, db_user, db_password, {
  dialect: "postgres",
  host: db_host,
  port: db_port,
});

// USER
const Role = role(sequelize);
const Customer = customer(sequelize);
const Seller = seller(sequelize);

// MERCHANT
const Merchant = merhcant(sequelize);

// FOOD
const Food = food(sequelize);
const FoodCategory = foodCategory(sequelize);
const Category = category(sequelize);

// LOCATION
const Location = location(sequelize);

// Associasion
Seller.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(Seller, { foreignKey: "roleId" });
Customer.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(Customer, { foreignKey: "roleId" });

Merchant.belongsTo(Seller, { foreignKey: "sellerId" });
Seller.hasOne(Merchant, { foreignKey: "sellerId" });
Merchant.belongsTo(Location, { foreignKey: "locationId" });
Location.hasOne(Merchant, { foreignKey: "locationId" });

Merchant.hasMany(Food, { foreignKey: "merchantId" });
Food.belongsTo(Merchant, { foreignKey: "merchantId" });
Food.hasMany(FoodCategory, { foreignKey: "foodId" });
FoodCategory.belongsTo(Food, { foreignKey: "foodId" });
Category.hasMany(FoodCategory, { foreignKey: "categoryId" });
FoodCategory.belongsTo(Category, { foreignKey: "categoryId" });

export {
  Sequelize,
  sequelize,
  Role,
  Customer,
  Seller,
  Merchant,
  Location,
  Food,
  FoodCategory,
  Category,
};
