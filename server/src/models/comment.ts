import { InferSchemaType, Schema, model } from "mongoose";

const comment = new Schema({
  authorId: { type: String, required: true },
  text: { type: String, required: true  }
});

type Comment = InferSchemaType<typeof comment>;

export default model<Comment>("Comment", comment);