import db from "../config/db";
import logger from "../src/utils/logger";

type Role = {
  name: string;
};

const getRole = (): Role[] => {
  return [{ name: "customer" }, { name: "seller" }];
};

const seed = async () => {
  const customers = await db.customer.findMany({
    where: { UserProfile: null },
  });
  await Promise.all(
    customers.map(async (customer) => {
      await db.userProfile.create({
        data: { id: customer.id, customerId: customer.id },
      });
    })
  );
};

seed();
