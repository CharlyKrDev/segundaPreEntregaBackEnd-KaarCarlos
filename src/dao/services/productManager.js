import fs from "fs/promises";
import path from "path";
import { __dirname } from "../../utils.js";

export class ProductManager {
  constructor(filePath) {
    this.products = [];
    this.path = filePath || path.resolve(__dirname, "data/Products.json");
  }

  async writeProduct() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.path, data);
    } catch (error) {
      console.error(`Problemas al crear el producto`, error);
    }
  }

  async readProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = data ? JSON.parse(data) : [];
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      this.products = [];
    }
  }
  async addProduct(newProduct) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = newProduct;
    try {
      await this.readProducts();

      const codeExists = await this.checkProductCode(code);
      if (codeExists) {
        throw new Error(`Ya existe un producto con el código ${code}`);
      }
      if (!(title && description && price && code && stock && category)) {
        throw new Error(
          `Los siguientes campos son obligatorios: title, description, code, price, stock, category`
        );
      }
      if(
        isNaN(price)
      ) {       throw new Error(`El precio debe ser con numeros`);
    }




      if (
        newProduct.status !== true &&
        newProduct.status !== false &&
        newProduct.status !== undefined
      ) {

        newProduct.status = true;

      }

      newProduct.thumbnail = [];

      if (!thumbnail) {
        newProduct.thumbnail = [];
      }  newProduct.thumbnail.push(thumbnail)  

      const lastId =
        this.products.length > 0
          ? this.products[this.products.length - 1].id
          : 0;
      const newId = lastId + 1;
      newProduct.id = newId;
      this.products.push(newProduct);
      this.writeProduct();
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    try {
      await this.readProducts();
      return this.products.length === 0 ? `No hay productos` : this.products;
    } catch (error) {
      throw error;

    }
  }
  async getProductId(productId) {
    try {
      await this.readProducts();
      const encontrarProductoId = this.products.find(
        (product) => product.id === productId
      );
      if (!encontrarProductoId) {
        throw new Error(`NOT FOUND: El producto con ID: ${productId} no existe`);
      }
      return encontrarProductoId;
    } catch (error) {
      throw error;

    }
  }
  async updateProduct(productId, updatedFields) {
    try {
      await this.readProducts();
      const checkId = await this.checkProductId(productId);
      if (!checkId) {
          throw new Error (`El ID no corresponde a ningún producto`);
      }

      const codeRegistered = await this.checkProductCode(updatedFields.code);

      if (codeRegistered) {
        throw new Error ("El código ya está registrado");
      }

      const consultarIndexPorId = this.products.findIndex(
        (product) => product.id === productId
      );

      if (consultarIndexPorId !== -1) {
        const keys = Object.keys(this.products[consultarIndexPorId]);
        const updatedKeys = Object.keys(updatedFields);

        const allKeysExist = updatedKeys.every((key) => keys.includes(key));
        if (updatedFields.id) {
          throw new Error (
            `El ID no se puede cambiar, las keys son: title, description, price, thumbnail, code y stock`
          );
        } else if (!allKeysExist) {
          throw new Error (
            `Para actualizar productos las keys son: title, description, price, thumbnail, code y stock`
          );
        } else {
          this.products[consultarIndexPorId] = {
            ...this.products[consultarIndexPorId],
            ...updatedFields,
          };
          this.writeProduct();
          throw new Error ("Producto actualizado correctamente");
        }
      } else {
        throw new Error (`El producto buscado no existe.`);
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteProduct(productId) {
    try {
      await this.readProducts();
      const prodFiltered = this.products.filter(
        (product) => product.id !== productId
      );
      if (prodFiltered) {
        this.products = prodFiltered;
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      throw error;
    }
  }
  

  async prodFiltered(productId){
    await this.readProducts();
    return this.products.filter(
      (product) => product.id !== productId
    );
  }
  async checkProductCode(code) {
    await this.readProducts();
    return this.products.some((product) => product.code === code);
  }

  async checkProductId(id) {
    await this.readProducts();
    return this.products.some((product) => product.id === id);
  }
}

