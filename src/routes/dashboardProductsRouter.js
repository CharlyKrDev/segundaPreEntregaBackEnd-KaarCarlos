import express from "express";

export const dashboardProductsRouter = express.Router();

dashboardProductsRouter.get("/", (req, res) => {
  res.render("dashboardProducts", {
    style: "style.css",
  });
});
