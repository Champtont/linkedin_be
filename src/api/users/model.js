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
    experiences: [
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
            "https://th.bing.com/th/id/R.4c474e6e070c93d1dca94c30765788b1?rik=gu6AihOGaNCGkw&riu=http%3a%2f%2fwww.advancehc.com.au%2fwp-content%2fuploads%2f2018%2f05%2fHigh-rise-buildings-and-blue-sky-Shinjuku-Tokyo-Japan-624031578_6016x4016.jpeg&ehk=%2fv9e9nzJWHz3iIxNBk8lbyzbyUVTIU9NDkce1fhGez8%3d&risl=&pid=ImgRaw&r=0",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
usersSchema.plugin(mongooseUniqueValidator, {
  message: "Error, expected userName to be unique.",
});

export default model("User", usersSchema);
