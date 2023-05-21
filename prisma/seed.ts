import db from "../config/db";

type Role = {
  name: string;
};

const getRole = (): Role[] => {
  return [{ name: "customer" }, { name: "seller" }];
};

const seed = async () => {
  await Promise.all(
    getRole().map(async (role) => {
      return await db.role.createMany({ data: [{ name: role.name }] });
    })
  );
};

seed();
