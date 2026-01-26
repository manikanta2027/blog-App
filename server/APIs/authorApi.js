const express = require("express");
const authorApp = express.Router();
const expressAsyncHandler = require("express-async-handler");
const Article = require("../models/articleModel");
const { requireAuth, clerkMiddleware } = require("@clerk/express");

authorApp.use(clerkMiddleware());

// middleware to check token
const tokenRequired = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token required" });
  }
  next();
};

// publish article (AUTHOR)
authorApp.post(
  "/article",
  requireAuth(),
  expressAsyncHandler(async (req, res) => {
    const newArticleObj = req.body;
    const newArticle = new Article(newArticleObj);
    const articleObj = await newArticle.save();
    res.status(201).send({ message: "Article published", payload: articleObj });
  })
);

// get all active articles
authorApp.get(
  "/articles",
  tokenRequired,
  expressAsyncHandler(async (req, res) => {
    const listOfArticles = await Article.find({ isArticleActive: true });
    res.status(200).send({ message: "articles", payload: listOfArticles });
  })
);

// modify article
authorApp.put(
  "/article/:articleId",
  requireAuth(),
  expressAsyncHandler(async (req, res) => {
    const modifiedArticle = req.body;
    const dbRes = await Article.findByIdAndUpdate(
      req.params.articleId,
      { ...modifiedArticle },
      { new: true }
    );
    res.status(200).send({ message: "article modified", payload: dbRes });
  })
);

// soft delete / restore
authorApp.put(
  "/articles/:articleId",
  expressAsyncHandler(async (req, res) => {
    const modifiedArticle = req.body;
    const dbRes = await Article.findByIdAndUpdate(
      req.params.articleId,
      { ...modifiedArticle },
      { new: true }
    );
    res
      .status(200)
      .send({ message: "article deleted or restored", payload: dbRes });
  })
);

// error handler
authorApp.use((err, req, res, next) => {
  if (err?.name === "ClerkExpressRequireAuthError") {
    return res.status(401).json({ message: "unauthorized request" });
  }
  res.status(500).json({ message: "server error" });
});

module.exports = authorApp;
