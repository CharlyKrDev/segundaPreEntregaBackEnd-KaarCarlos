import fs from "fs/promises";
import path from "path";
import { __dirname } from "../../utils.js";

export class CartManager {
  constructor(
    filePathCart = path.resolve(__dirname, "data/Carts.json"),
    filePathProd = path.resolve(__dirname, "data/Products.json")
  ) {
    this.carts = [];
    this.pathCart = filePathCart;
    this.pathProd = filePathProd;
  }

  async readProducts() {
    try {
      const data = await fs.readFile(this.pathProd, "utf-8");
      this.products = data ? JSON.parse(data) : [];
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      this.products = [];
    }
  }
  async writeCart() {
    try {
      const data = JSON.stringify(this.carts, null, 2);
      await fs.writeFile(this.pathCart, data);
    } catch (error) {
      console.error(`Problemas al crear el producto`, error);
    }
  }

  async readCart() {
    try {
      const data = await fs.readFile(this.pathCart, "utf-8");
      this.carts = data ? JSON.parse(data) : [];
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      this.carts = [];
    }
  }

  async createCart(newCart) {
    const { products = [] } = newCart || {};

    try {
      await this.readCart();
      const lastId =
        this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
      const newId = lastId + 1;
      const cartWithId = {
        id: newId,
        products: products,
      };
      this.carts.push(cartWithId);
      this.writeCart();
      return newCart;
    } catch (error) {
      console.error(`Problemas al agregar el producto al carrito`, error);
      throw error;
    }
  }

  async getCartId(cartId) {
    try {
      await this.readCart();
      const encontrarCarritoId = this.carts.find((cart) => cart.id === cartId);
      return !encontrarCarritoId
        ? console.error(`NOT FOUND: El producto con ID: ${cartId} no existe`)
        : encontrarCarritoId;
    } catch (error) {
      console.error(`Error al consultar productos`, error);
      return [];
    }
  }

  async addProductToCart(cartId, prodId, addProduct) {
    const { products = [] } = addProduct || {};

    try {
      await this.readCart();
      await this.readProducts();
      const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) {
        return;
      }
      const productIndex = this.products.findIndex(
        (product) => product.id === prodId
      );
      if (productIndex === -1) {
        return;
      }

      const { id } = this.products[productIndex];
      const { quantity } = this.carts[cartIndex].products.find(
        (cart) => cart.id === id
      ) || { quantity: 0 };
      if (quantity === 0) {
        this.carts[cartIndex].products.push({ id, quantity: 1 });
      } else {
        this.carts[cartIndex].products.find((cart) => cart.id === id)
          .quantity++;
      }

      this.writeCart();
    } catch (error) {
      console.error(`Problemas al agregar el producto al carrito`, error);
    }
  }

  async checkCartId(id) {
    await this.readCart();
    return this.carts.some((cart) => cart.id === id);
  }

  async checkProductId(id) {
    await this.readProducts();
    return this.products.some((product) => product.id === id);
  }
}
