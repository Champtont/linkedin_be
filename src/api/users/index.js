import express from "express";
import createHttpError from "http-errors";
import UserModel from "./model.js";
import multer from "multer";
import { pipeline } from "stream";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { getPDFReadableStream } from "../lib/pdf_tools.js";

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
      //find the user and update
      const user = await UserModel.findByIdAndUpdate(
        req.params.userId,
        { image: req.file.path },
        { new: true }
      );
      if (!user)
        next(
          createHttpError(404, `No user wtih the id of ${req.params.userId}`)
        );
      res.status(201).send(user);
    } catch (error) {
      res.send(error);
      next(error);
    }
  }
);

//and PDF

usersRouter.get("/:userId/pdf", async (req, res, next) => {
  res.setHeader("Content-Disposition", "attachment; filename=myCV.pdf");

  const user = await UserModel.findById(req.params.userId);
  const source = await getPDFReadableStream(user);
  const destination = res;
  pipeline(source, destination, (err) => {
    if (err) console.log(err);
    else console.log("stream ended successfully");
  });
});

export default usersRouter;
