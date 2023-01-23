import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, uniqueCaseInsensitive: true },
    bio: { type: String, required: true },
    title: { type: String, required: true },
    area: { type: String, required: true },
    image: {
      type: String,
      required: true,
      default:
        "https://www.labrador-owners.co.uk/images/user_images//system/default.jpg?v=1632230965",
    },
    username: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);
usersSchema.plugin(mongooseUniqueValidator, {
  message: "Error, expected userName to be unique.",
});

export default model("User", usersSchema);
