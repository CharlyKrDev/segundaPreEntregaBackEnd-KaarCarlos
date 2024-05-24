import { Router } from "express";
import { CartManager } from "../dao/services/cartManager.js";

const cartsRouter = Router();

const cartsManager = new CartManager();

cartsRouter.get("/api/carts/:cid", async (req, res) => {
  const id = parseInt(req.params.cid);
  try {
    const cart = await cartsManager.getCartId(id);
    if (!cart)
      return res.status(404).json(`El id: ${id} no pertenece a ningún carrito`);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(`Error al obtener el producto por ID`, error);
  }
});

cartsRouter.post("/api/carts", async (req, res) => {
  const cartEmpty = [];
  try {
    cartsManager.createCart(cartEmpty);

    res.status(201).json({ message: `Carrito creado correctamente` });
  } catch (error) {
    res.status(500).json(`Error al obtener cargar producto en carrito`, error);
  }
});

cartsRouter.post("/api/carts/:cid/products/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const prodId = parseInt(req.params.pid);

  try {
    const checkId = await cartsManager.checkProductId(prodId);
    const checkIdCart = await cartsManager.checkCartId(cartId);

    if (!checkId) {
      return res
        .status(400)
        .json(`Debe seleccionar el id de producto existente`);
    }
    if (!checkIdCart) {
      return res
        .status(400)
        .json(`Debe seleccionar el id de un carrito existente`);
    }
    const addToCart = cartsManager.addProductToCart(cartId, prodId);

    res.status(201).json({
      message: `Agregado producto id: ${prodId} al carrito id: ${cartId}`,
    });
  } catch (error) {
    res.status(500).json(`Error al obtener cargar producto en carrito`, error);
  }
});

export default cartsRouter;
