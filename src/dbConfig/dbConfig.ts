import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("mongodb connected");
    });

    connection.on("error", (error) => {
      console.log("mongodb connection error", error);
      process.exit();
    });
  } catch (error) {
    console.log("something wrong in db connect");
    console.log(error);
  }
}
