import { Router } from "express";
import mongoose from "mongoose";
import cartsModel from "../dao/models/carts.models.js";
import productsModel from "../dao/models/products.model.js";

const ObjectId = mongoose.Types.ObjectId;
const cartsRouterM = Router();

//Todos los carritos

cartsRouterM.get('/api/carts/', async(req, res) =>{
  try {

    const carts = await cartsModel.find().lean();
    console.log(carts)

    res.status(200).send(carts)
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Error al obtener el carrito por ID`,
        error: error.message,
      });
  }


})

// Obtener un carrito por ID
cartsRouterM.get("/api/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsModel.findById(cid).populate('products.productId').lean();


    if (!cart) {
      return res
        .status(404)
        .json({ message: `El id: ${cid} no pertenece a ningún carrito` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Error al obtener el carrito por ID`,
        error: error.message,
      });
  }
});

// Crear un nuevo carrito
cartsRouterM.post("/api/carts", async (req, res) => {
  try {
    const newCart = new cartsModel({ products: [] });
    await newCart.save();
    res
      .status(201)
      .json({ cart: newCart, message: `Carrito creado correctamente` });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error al crear el carrito`, error: error.message });
  }
});

// Agregar producto al carrito
cartsRouterM.put("/api/carts/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    // Verificar si el producto existe
    const product = await productsModel.findById(pid);
    if (!product) {
      return res
        .status(400)
        .json({ message: "Debe seleccionar el id de producto existente" });
    }

    // Verificar si el carrito existe
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res
        .status(400)
        .json({ message: "Debe seleccionar el id de un carrito existente" });
    }

    // Verificar si el producto ya está en el carrito
    const productInCart = cart.products.find((p) => p.productId.equals(pid));

    if (productInCart) {
      // Incrementar la cantidad si el producto ya está en el carrito
      productInCart.quantity += 1;
    } else {
      // Agregar el producto al carrito si no está
      cart.products.push({ productId: new ObjectId(pid), quantity: 1 });
    }

    // Guardar los cambios
    await cart.save();

    res
      .status(201)
      .json({
        message: `Agregado producto id: ${pid} al carrito id: ${cid}`,
        cart,
      });
  } catch (error) {
    console.error(`Error al agregar el producto al carrito:`, error);
    res
      .status(500)
      .json({
        message: "Error al agregar el producto al carrito",
        error: error.message,
      });
  }
});
//Borrar producto del carrito
cartsRouterM.delete("/api/carts/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    // Verificar si el producto existe
    const product = await productsModel.findById(pid);
    if (!product) {
      return res
        .status(400)
        .json({ message: "Debe seleccionar el id de producto existente" });
    }

    // Verificar si el carrito existe
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res
        .status(400)
        .json({ message: "Debe seleccionar el id de un carrito existente" });
    }

    // Verificar si el producto ya está en el carrito
    const productIndex = cart.products.findIndex((p) =>
      p.productId.equals(pid)
    );
    if (productIndex !== -1) {
      const productInCart = cart.products[productIndex];
      if (productInCart.quantity > 1) {
        productInCart.quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }

      await cart.save();

      res
        .status(200)
        .json({
          message: `Actualizada la cantidad del producto id: ${pid} en el carrito id: ${cid}`,
          cart,
        });
    } else {
      res
        .status(400)
        .json({
          message: `El producto id: ${pid} no se encuentra en el carrito id: ${cid}`,
        });
    }
  } catch (error) {
    console.error(
      `Error al actualizar la cantidad del producto en el carrito:`,
      error
    );
    res
      .status(500)
      .json({
        message: "Error al actualizar la cantidad del producto en el carrito",
        error: error.message,
      });
  }
});

//Borrar carrito
cartsRouterM.delete("/api/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    // Verificar si el carrito existe
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res
        .status(400)
        .json({ message: "Debe seleccionar el id de un carrito existente" });
    } else {
      await cartsModel.deleteOne({ _id: cid });

      res
        .status(200)
        .json({ message: `Carrito ID: ${cid} borrado correctamente!` });
    }
  } catch (error) {
    console.error(`Error al querer borrar carrito:`, error);
    res
      .status(500)
      .json({
        message: `Al querer borrar el carrito${cid}`,
        error: error.message,
      });
  }
});

export default cartsRouterM;
