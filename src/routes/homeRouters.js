import express from "express";
import productsModel from "../dao/models/products.model.js";



export const homeRouter = express.Router()




homeRouter.get("/", async (req, res) => {

  const limit = parseInt(req.query.limit);

  try {
    let products;
    if(!isNaN(limit)) {

      products = await productsModel.find().limit(limit).lean();

    } else{
      products = await productsModel.find().lean()
    }

    res.render('home',{
      style:'style.css',
      productos: products

    })
  
  } catch (error) {
    res.status(404).json({ error: error.message }); 
  }
});