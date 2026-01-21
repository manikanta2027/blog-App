const express = require("express");
const userApp = express.Router();
const userAuthor = require("../models/userAuthorModel");
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require("./createUserOrAuthor");
const Article = require("../models/articleModel");

//API


//create new user
userApp.post("/user",expressAsyncHandler(createUserOrAuthor));

//add comment to an article
userApp.put("/comment/:articleId",expressAsyncHandler(async(req,res)=>{

    const commentObj = req.body;
    const articleWithComments = await Article.findOneAndUpdate(
        {articleId : req.params.articleId},
        {$push: {comments : commentObj}},
        {returnOriginal : false});
        res.status(200).send({ message: "comment added", payload: articleWithComments });


}));

userApp.delete(
  "/comment/:articleId/:commentId",
  expressAsyncHandler(async (req, res) => {
    const { articleId, commentId } = req.params;

    // remove comment by _id
    const updatedArticle = await Article.findOneAndUpdate(
      { articleId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    res.status(200).send({ message: "comment deleted", payload: updatedArticle });
  })
);




module.exports = userApp;