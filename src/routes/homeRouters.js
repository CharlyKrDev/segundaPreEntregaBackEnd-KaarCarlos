import express from "express";
import productsModel from "../dao/models/products.model.js";

export const homeRouter = express.Router();

homeRouter.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, debug } = req.query;
    const totalProduct = await productsModel.countDocuments()
    // Convert limit to a number if it's not "all"
    limit = limit === "all" ? totalProduct : parseInt(limit);
    page = parseInt(page);

    // Validate limit and page parameters
    if (isNaN(page) || page < 1 || (limit !== undefined && (isNaN(limit) || limit < 1))) {
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
      ? `http://localhost:8080/products/?page=${products.prevPage}&limit=${limit}`
      : "";
    const nextLink = products.hasNextPage
      ? `http://localhost:8080/products/?page=${products.nextPage}&limit=${limit}`
      : "";
    const isValid = !(page <= 0 || page > products.totalPages);

    res.render("home", {
      style: "style.css",
      productos: products.docs,
      totalPages: products.totalPages,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      prevLink,
      nextLink,
      isValid,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
