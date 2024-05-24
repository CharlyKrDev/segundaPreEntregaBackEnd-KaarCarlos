import { __dirname } from "../utils.js";

import productsModel from "../dao/models/products.model.js";

export const socketConnection = (socketServer) => {
  socketServer.on("connection", async (socket) => {
    console.log(`New client connected`);

    try {
      const products = await productsModel.find().lean();
      socket.emit("currentProducts", products);
    } catch (error) {
      console.error("Error al enviar productos al cliente:", error);
      socket.emit("error", { message: "Error al procesar la solicitud" });
    }

    socket.on("addProduct", async (newProduct) => {
      try {

        if (
          newProduct.status !== true &&
          newProduct.status !== false &&
          newProduct.status !== undefined
        ) {
  
          newProduct.status = true;
  
        }
        await productsModel.create(newProduct);
        const updatedProducts = await productsModel.find().lean();

        socketServer.emit("updateProducts", updatedProducts);
      } catch (error) {
        console.error("Error al agregar producto:", error);
        socket.emit("error", { message: "Error al agregar producto" });
      }
    });

    socket.on("deleteProduct", async (productId) => {
      try {
        await productsModel.deleteOne({ _id: productId });
        const updatedProducts = await productsModel.find().lean();
        socketServer.emit("updateProducts", updatedProducts);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        socket.emit("error", { message: "Error al eliminar producto" });
      }
    });
  });
};
