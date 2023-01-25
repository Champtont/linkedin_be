import express from "express";
import createHttpError from "http-errors";
import UserModel from "./model.js";
import multer from "multer";
import { pipeline } from "stream";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    console.log(error);
    createHttpError(
      400,
      "The username ${req.params.username} is already taken, Please choose a different name"
    );
    res.status(400).send(error);
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `user with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(204).send("successfully deleted");
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//Profile picture

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "UserProfilePhotos",
    },
  }),
}).single("profilePic");

usersRouter.post(
  "/:userId/profilePic",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      console.log(req.file);
      const url = req.file.path;
      //find the user
      const oldUser = await UserModel.findById(req.params.userId);
      console.log("2");
      //add new image url to ... I am having trouble overwriting the data that was there
      const updatePic = { oldUser, image: url };
      console.log("3");
      const updatedUser = updatePic;
      console.log(updatedUser);
      console.log("4");
      res.status(201).send(updatedUser._doc);
    } catch (error) {
      res.send(error);
      next(error);
    }
  }
);

//and PDF

// Epreriences embedded
usersRouter.get("/:userId/experiences", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    console.log(user);
    if (user) {
      res.send(user.experiences);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/:userId/experiences", async (req, res, next) => {
  try {
    const newExperience = { ...req.body };
    if (newExperience) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.userId,
        { $push: { experiences: newExperience } },
        { new: true, runValidators: true }
      );
      res.send(updatedUser);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/:userId/experiences/:experienceId",
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.userId);
      if (user) {
        const currentExperience = user.experiences.find(
          (user) => user._id.toString() === req.params.experienceId
        );
        if (currentExperience) {
          res.send(currentExperience);
        } else {
          next(
            createHttpError(
              404,
              `Experience with id ${req.params.experienceId} not found!`
            )
          );
        }
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.put(
  "/:userId/experiences/:experienceId",
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.userId);
      if (user) {
        const index = user.experiences.findIndex(
          (experience) => experience._id.toString() === req.params.experienceId
        );
        const updatedExperience = user.experiences[index].toObject();
        user.experiences[index] = {
          ...updatedExperience,
          ...req.body,
        };
        await user.save();
        res.status(200).send(user);
      } else {
        next(
          createHttpError(
            `Experience with id ${req.params.experienceId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.delete(
  "/:userId/experiences/:experienceId",
  async (req, res, next) => {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.userId,
        {
          $pull: { experiences: { _id: req.params.experienceId } },
        },
        { new: true }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(createHttpError("Not working :)"));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
