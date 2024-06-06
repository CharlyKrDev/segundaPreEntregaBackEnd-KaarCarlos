import express from "express";

export const messagesRouter = express.Router();

messagesRouter.get("/", (req, res) => {
  res.render("chat", {
    style: "style.css",
  });
});
