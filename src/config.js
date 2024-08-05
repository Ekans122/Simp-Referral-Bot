import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export async function dbConnect() {
  try {
      console.log(process.env.MONGO_URI);
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
  } catch (error) {
      console.log(error);
      return process.exit(1);
  }
}

export const { TOKEN, BACKEND_URL, PORT, REFERRALLINK } = process.env;