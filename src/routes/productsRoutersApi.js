import express from "express";
import productsModel from "../dao/models/products.model.js";
import cartsModel from "../dao/models/carts.models.js";

export const productsRouterApi = express.Router();

productsRouterApi.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, debug } = req.query;
    const totalProduct = await productsModel.countDocuments();
    const carts = await cartsModel.find().lean();
    // Convert limit to a number if it's not "all"
    limit = limit === "all" ? totalProduct : parseInt(limit);
    page = parseInt(page);

    // Validate limit and page parameters
    if (
      isNaN(page) ||
      page < 1 ||
      (limit !== undefined && (isNaN(limit) || limit < 1))
    ) {
      return res.status(400).json({ error: "Invalid limit or page value" });
    }

    const options = {
      limit,
      page,
      sort: sort ? { price: sort } : {},
      lean: true,
    };

    const products = await productsModel.paginate({}, options);

    if (debug) {
      return res.json({
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
      });
    }

    const prevLink = products.hasPrevPage
      ? `http://localhost:8080/api/products/?page=${products.prevPage}&limit=${limit}`
      : "";
    const nextLink = products.hasNextPage
      ? `http://localhost:8080/api/products/?page=${products.nextPage}&limit=${limit}`
      : "";
    const isValid = !(page <= 0 || page > products.totalPages);

    res.status(200).json({
      productos: products.docs,
      totalPages: products.totalPages,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      prevLink: prevLink,
      nextLink: nextLink,
      isValid: isValid,
      carts: carts,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
productsRouterApi.get("/:pid", async (req, res) => {
  const productId = req.params.pid;
  try {
    let product;

    product = await productsModel.findOne({ _id: productId });
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

productsRouterApi.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;

  try {
    let checkId = await productsModel.findOne({ _id: productId });
    if (!checkId) {
      return res
        .status(404)
        .send(`No se encontró ningún producto con el ID ${productId}`);
    }
    await productsModel.deleteOne({ _id: productId });
    res
      .status(200)
      .json({
        message: `El producto id: ${productId} ha sido eliminado correctamente`,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


productsRouterApi.put("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  } = req.body;
  try {
    let checkId = await productsModel.findOne({ _id: productId });
    if (!checkId) {
      return res
        .status(404)
        .send(`No se encontró ningún producto con el ID ${productId}`);
    }

    let checkCode = await productsModel.find({ code: code });

    if (checkCode.length > 0) {
      return res.status(400).json({ error: "Code existente" });
    }
    await productsModel.updateOne({ _id: productId }, req.body);

    res.status(200).json({ message: `Producto actualizado correctamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


productsRouterApi.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  } = req.body;
  try {
    let checkCode = await productsModel.find({ code: code });

    if (checkCode.length > 0) {
      return res.status(400).json({ error: "Code existente" });
    }

    const newProduct = await productsModel.create(req.body);

    res.status(200).json({
      Producto: newProduct,
      message: `Producto cargado correctamente`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});