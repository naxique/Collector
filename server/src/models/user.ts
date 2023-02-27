import { InferSchemaType, Schema, model } from "mongoose";

const user = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true  },
  password: { type: String, required: true },
  description: { type: String, default: "" },
  collections: { type: [String], default: [""] },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
});

type User = InferSchemaType<typeof user>;

export default model<User>("User", user);