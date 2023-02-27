import { InferSchemaType, Schema, model } from "mongoose";

const token = new Schema({
  token: { type: String, unique: true, required: true }
});

type Token = InferSchemaType<typeof token>;

export default model<Token>("Token", token);