import express from "express";

export const realTimeProductsRouter = express.Router();

realTimeProductsRouter.get("/", (req, res) => {
  res.render("realTimeProducts", {
    style: "style.css",
  });
});
