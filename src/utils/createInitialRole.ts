import { Role } from "../models";

export default () => {
  Role.create({
    name: "customer",
  });

  Role.create({
    name: "seller",
  });

  Role.create({
    name: "admin",
  });
};
