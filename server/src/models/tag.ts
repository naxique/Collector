import { InferSchemaType, Schema, model } from "mongoose";

const tag = new Schema({
  name: { type: String, required: true },
  timesUsed: { type: Number, default: 0 }
});

type Tag = InferSchemaType<typeof tag>;

export default model<Tag>("Tag", tag);