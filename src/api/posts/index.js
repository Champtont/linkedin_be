import express from "express";
import createHttpError from "http-errors";
import PostModel from "./model.js";
import multer from "multer";
import { pipeline } from "stream";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const postsRouter = express.Router();

postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await PostModel.find().populate({
      path: "user",
      select: "name surname image username email title",
    });
    res.send(posts);
  } catch (error) {
    res.send(error);
    next(error);
  }
});

postsRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId).populate({
      path: "user",
      select: "name surname image username email title",
    });
    if (post) {
      res.send(post);
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
  } catch (error) {
    res.send(error);
    next(error);
  }
});

postsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body);
    const { _id } = await newPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    res.send(error);
    next(error);
  }
});

postsRouter.put("/:postId", async (req, res, next) => {
  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    res.send(error);
    next(error);
  }
});

postsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const deletedPost = await PostModel.findByIdAndDelete(req.params.postId);
    if (deletedPost) {
      res.status(204).send("successfully deleted");
    } else {
      next(
        next(
          createHttpError(404, `Post with id ${req.params.postId} not found!`)
        )
      );
    }
  } catch (error) {
    res.send(error);
    next(error);
  }
});

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "PostsProfilePhotos",
    },
  }),
}).single("profilePostsPic");

postsRouter.post(
  "/:postId/profilePostsPic",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      //find the user and update
      const post = await PostModel.findByIdAndUpdate(
        req.params.postId,
        { image: req.file.path },
        { new: true }
      );
      if (!post)
        next(
          createHttpError(404, `No user wtih the id of ${req.params.postId}`)
        );
      res.status(201).send(post);
    } catch (error) {
      res.send(error);
      next(error);
    }
  }
);

export default postsRouter;
