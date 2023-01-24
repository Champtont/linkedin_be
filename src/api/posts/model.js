import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postsSchema = new Schema(
  {
    text: { type: String, required: true },
    image: {
      type: String,
      required: true,
      default: "https://picsum.photos/600",
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },

  {
    timestamps: true,
  }
);

export default model("Post", postsSchema);
