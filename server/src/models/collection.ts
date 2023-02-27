import { InferSchemaType, Schema, model } from "mongoose";

const collection = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  authorId: { type: String, required: true },
  theme: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  customFields: { type: [Object], default: [{}] },
  items: { type: [Object], default: [{}] }
});

type Collection = InferSchemaType<typeof collection>;

export default model<Collection>("Collection", collection);