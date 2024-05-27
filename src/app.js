import express from "express";
import { viewsPath, publicPath } from "./utils.js";
import { realTimeProductsRouter } from "./routes/realTimeProductsRouter.js";
import { homeRouter } from "./routes/homeRouters.js";
import cartsRouterM from "./routes/carts.router.js";
// import { registerRouter } from "./routes/registerRouter.js";
import { Server } from "socket.io";
import productsRouter from "./routes/productsRouters.js";
import { messagesRouter } from "./routes/messagesRouters.js";
// import cartsRouter from "./routes/cartsRouters.js";
import handlebars from "express-handlebars";
import { socketConnection } from "./connection/handleSockets.js";
import { messagesConnection } from "./connection/messagesSockets.js";

import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
const PORT = 8080;
const httpServer = app.listen(
  PORT,
  console.log(`Server running on port: http://localhost:${PORT}/home`)
);
const socketServer = new Server(httpServer);
dotenv.config();
const mongoServer = process.env.MONGO_URL;

app.set("views", viewsPath);
app.enable("view cache");
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

app.use("/", productsRouter);
app.use("/", cartsRouterM);
app.use("/realTimeProducts", realTimeProductsRouter);
app.use("/messages", messagesRouter);
app.use("/products", homeRouter);

mongoose
  .connect(mongoServer)
  .then(() => {
    console.log("Conectado a la DB");
  })
  .catch((error) => {
    console.error(error, `error`);
  });

socketConnection(socketServer);
messagesConnection(socketServer);
