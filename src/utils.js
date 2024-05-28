import { fileURLToPath } from "url";
import { dirname, join } from "path";
import handlebars from "express-handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viewsPath = join(__dirname + "/views");
const publicPath = join(__dirname + "/public");

const hbs = handlebars.create({
    defaultLayout: 'main',
    helpers: {
      multiply: (a, b) => a * b
    }
  });

export { __dirname, viewsPath, publicPath, __filename, hbs };
