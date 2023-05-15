import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import { port } from "./config/config";
import createInitialRole from "./utils/createInitialRole";
import { Role, sequelize } from "./models";
import customerAuthRouter from "./routes/auth/customer";
import sellerAuthRouter from "./routes/auth/seller";
import locationRouter from "./routes/location/location";
import merchantRouter from "./routes/merchant/merchant";
import { swaggerDocs } from "./utils/swagger";

sequelize.sync({ alter: true }).then(async () => {
  const roles = await Role.findAll();
  if (roles.length == 0) {
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

app.listen(port, () => {
  swaggerDocs(app, port);
  console.log(`Application started on port ${port}`);
});
