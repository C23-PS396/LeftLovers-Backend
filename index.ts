import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import { port } from "./config/config";
import createInitialRole from "./src/utils/createInitialRole";
import { Role, sequelize } from "./src/models";
import customerAuthRouter from "./src/routes/auth/customer";
import sellerAuthRouter from "./src/routes/auth/seller";
import locationRouter from "./src/routes/location/location";
import merchantRouter from "./src/routes/merchant/merchant";
import categoryRouter from "./src/routes/food/category";
import { swaggerDocs } from "./src/utils/swagger";
import logger from "./src/utils/logger";

sequelize.sync({ alter: true }).then(async () => {
  const roles = await Role.findAll();
  if (roles.length === 0) {
    createInitialRole();
  }
});

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/auth/customer", customerAuthRouter);
app.use("/api/v1/auth/seller", sellerAuthRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/merchant", merchantRouter);
app.use("/api/v1/food/category", categoryRouter);

app.listen(port, () => {
  swaggerDocs(app, port);
  logger.info(`Application started on port ${port}`);
});
