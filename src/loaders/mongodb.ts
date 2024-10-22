import env from "../config";
import mongoose from "mongoose";

const mongodbConnect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }
  try {
    mongoose.connect(env.MONGO_PATH);
  } catch (err) {
    console.error(err);
  }
};

mongodbConnect();
mongoose.connection.on("connected", () => {
  console.log("몽고디비에 연결되었습니다. 😊");
});
mongoose.connection.on("disconnected", mongodbConnect);

export default mongodbConnect;
