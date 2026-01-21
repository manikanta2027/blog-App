const express = require("express");
const userApp = express.Router();
// const authorApp = require("../models/userAuthorModel");
// const authorApp = express.Router();
const expressAsyncHandler = require("express-async-handler")
const createUserOrAuthor = require("./createUserOrAuthor");
const Article = require("../models/articleModel");
const {requireAuth,clerkMiddleware} = require("@clerk/express");
require("dotenv").config();
userApp.use(clerkMiddleware());

//create a user or author
userApp.post("/author",expressAsyncHandler(createUserOrAuthor));
userApp.post("/article",expressAsyncHandler(async(req,res)=>{
     
    const newArticleObj = req.body;
    console.log("Article being saved:", newArticleObj);
    const newArticle = new Article(newArticleObj);
    const articleObj = await newArticle.save();
    res.status(201).send({message:"Article published", payload:articleObj});
}));

userApp.get("/articles",requireAuth({signInUrl:"/unauthorized"}),expressAsyncHandler(async(req,res)=>{
    const listOfArticles = await Article.find({isArticleActive: true});
    res.status(200).send({message:"articles", payload:listOfArticles})
}))

userApp.get("/unauthorized",(req,res)=>{
    res.send({message:"unauthorized request"});
})

//modify an article by article Id

userApp.put("/article/:articleId",requireAuth({signInUrl:"/unauthorized"}),expressAsyncHandler(async(req,res)=>{

    const modifiedArticle = req.body;
    const dbRes = await Article.findByIdAndUpdate(req.params.articleId,{...modifiedArticle},{returnOriginal : false})
    res.status(200).send({message:"article modified",payload:dbRes})
}))

//delete(soft delete) an article by article Id

userApp.put("/articles/:articleId",expressAsyncHandler(async(req,res)=>{

    const modifiedArticle = req.body;
    const dbRes = await Article.findByIdAndUpdate(req.params.articleId,{...modifiedArticle},{returnOriginal : false})
    res.status(200).send({message:"article deleted or restored",payload:dbRes})
}))

module.exports = userApp;