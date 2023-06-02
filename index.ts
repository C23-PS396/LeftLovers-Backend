import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import customerAuthRouter from "./src/routes/auth/customer";
import sellerAuthRouter from "./src/routes/auth/seller";
import locationRouter from "./src/routes/location/location";
import merchantRouter from "./src/routes/merchant/merchant";
import categoryRouter from "./src/routes/food/category";
import foodRouter from "./src/routes/food/food";
import bankRouter from "./src/routes/bank/bank";
import transactionRouter from "./src/routes/transaction/transaction";
import reviewRouter from "./src/routes/review/review";
import uploadRouter from "./src/routes/upload/upload";
import { swaggerDocs } from "./src/utils/swagger";
import logger from "./src/utils/logger";
import { PORT } from "./config/config";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/auth/customer", customerAuthRouter);
app.use("/api/v1/auth/seller", sellerAuthRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/merchant", merchantRouter);
app.use("/api/v1/food", foodRouter);
app.use("/api/v1/food/category", categoryRouter);
app.use("/api/v1/bank", bankRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/upload", uploadRouter);

app.listen(PORT, () => {
  swaggerDocs(app, PORT);
  logger.info(`Application started on port ${PORT}`);
});
