import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postsSchema = new Schema(
  {
    category: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
    user: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },

  {
    timestamps: true,
  }
);

export default model("Posts", postsSchema);
