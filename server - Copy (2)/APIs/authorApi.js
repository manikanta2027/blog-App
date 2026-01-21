const express = require("express");
const userApp = express.Router();
const authorApp = require("../models/userAuthorModel");
const expressAsyncHandler = require("express-async-handler")
const createUserOrAuthor = require("./createUserOrAuthor");
const Article = require("../models/articleModel");


userApp.post("/author",expressAsyncHandler(createUserOrAuthor));
userApp.post("/article",expressAsyncHandler(async(req,res)=>{
     
    const newArticleObj = req.body;
    const newArticle = new Article(newArticleObj);
    const articleObj = await newArticle.save();
    res.status(201).send({message:"Article published", payload:articleObj});
}));

userApp.get("/articles",expressAsyncHandler(async(req,res)=>{
    const listOfArticles = await Article.find(isArticleActive=true);
    res.status(200).send({message:"list of articles", payload:listOfArticles}); 
}))

//modify an article by article Id

userApp.put("/article/:articleId",expressAsyncHandler(async(req,res)=>{

    const modifiedArticle = req.body;
    const dbRes = await Article.findByIdAndUpdate(modifiedArticle._id,{...modifiedArticle},{returnOriginal : false})
    res.status(200).send({message:"article modified",payload:dbRes})
}))

//delete(soft delete) an article by article Id

userApp.put("/articles/:articleId",expressAsyncHandler(async(req,res)=>{

    const modifiedArticle = req.body;
    const dbRes = await Article.findByIdAndUpdate(modifiedArticle._id,{...modifiedArticle},{returnOriginal : false})
    res.status(200).send({message:"article deleted",payload:dbRes})
}))

module.exports = userApp;