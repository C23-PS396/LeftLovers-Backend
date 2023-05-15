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

export { Sequelize, sequelize, Role, Customer, Seller, Merchant, Location };
