import mongoose from "mongoose";

const cartsCollection = "carts";

const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const cartsSchema = new mongoose.Schema({
  products: [productSchema],
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
