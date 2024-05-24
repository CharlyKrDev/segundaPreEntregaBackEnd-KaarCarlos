import { __dirname } from "../utils.js";
import messagesModel from "../dao/models/messages.models.js";

export const messagesConnection = (socketServer) => {
  console.log(`Message client connected`);

  socketServer.on("connection", async (socket) => {
    try {
      socket.on("message", async ({ message, user }) => {
        if (!message || !user) {
          return;
        }
        const existingUser = await messagesModel.findOne({ user });
        if (existingUser) {
          existingUser.messages.push(message);
          await existingUser.save();
          socketServer.emit('message', existingUser.messages);
        } else {
          const newUser = await messagesModel.create({ user, messages: [message] });
          socketServer.emit('message', newUser.messages);
        }
      });
    } catch (error) {
      console.error("Error al cargar mensaje del cliente:", error);
      socket.emit("error", { message: "Error al procesar la solicitud" });
    }
  });
  
};




