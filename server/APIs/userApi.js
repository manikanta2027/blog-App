const express = require("express");
const userApp = express.Router();
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require("./createUserOrAuthor");
const Article = require("../models/articleModel");

// create user
userApp.post("/user", expressAsyncHandler(createUserOrAuthor));

// 🔥 ADD THIS LINE
userApp.post("/author", expressAsyncHandler(createUserOrAuthor));

// add comment
userApp.put("/comment/:articleId", expressAsyncHandler(async(req,res)=>{

    const commentObj = req.body;
    const articleWithComments = await Article.findOneAndUpdate(
        {articleId : req.params.articleId},
        {$push: {comments : commentObj}},
        {returnOriginal : false}
    );

    res.status(200).send({ message: "comment added", payload: articleWithComments });
}));

userApp.delete(
  "/comment/:articleId/:commentId",
  expressAsyncHandler(async (req, res) => {
    const { articleId, commentId } = req.params;

    const updatedArticle = await Article.findOneAndUpdate(
      { articleId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    res.status(200).send({ message: "comment deleted", payload: updatedArticle });
  })
);

module.exports = userApp;
