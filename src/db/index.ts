import { config } from "#/utils/variables";
import mongoose from "mongoose";

mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.log("db connection failed: ", err);
  });
