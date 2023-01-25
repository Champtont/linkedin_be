import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const { Schema, model } = mongoose;

const experiencesSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    description: { type: String, required: true },
    area: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://www.labrador-owners.co.uk/images/user_images//system/default.jpg?v=1632230965",
      required: true,
    },
  },
  { timestamps: true }
);

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
    experiences: [experiencesSchema],

  },
  {
    timestamps: true,
  }
);
usersSchema.plugin(mongooseUniqueValidator, {
  message: "Error, expected userName to be unique.",
});

export default model("User", usersSchema);
