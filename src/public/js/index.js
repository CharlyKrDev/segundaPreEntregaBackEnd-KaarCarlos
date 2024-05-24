const socket = io();

// Re renderizado posterior a modificaciones
socket.on("currentProducts", async function (products) {
  renderProductList(products);
});

socket.on("updateProducts", async function (products) {
  renderProductList(products);
});

socket.on("addProduct", async function (products) {
  renderProductList(products);
});

// Renderizado de productos

function renderProductList(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  try {
    products.forEach((product) => {
      const liProduct = document.createElement("ul");
      liProduct.innerHTML = ` 
          <div class="cardContainer">     
          <h2 class="titleCard">${product.title}</h2>
          <img class="imgCard" src="${product.thumbnail}" alt="${product.title}" />
          <section class="textCard">
            <p>ID: ${product._id}</p>
            <p>${product.description}</p>
            <p>Stock: ${product.stock} unidades</p>
            <p><span>${product.price}</span></p>
            <button class="btnDelete2" data-id="${product.id}">Eliminar</button>
          </section>
          </div>`;
      productList.appendChild(liProduct);

      const btnDelete2 = liProduct.querySelector(".btnDelete2");
      btnDelete2.addEventListener("click", () => {
        console.log(`Click delete`)
        deleteProduct(product._id);
      });
    });
  } catch (error) {
    console.error("Error al procesar los productos:", error);
  }
}

// Borrar Producto por ID
const deleteProduct = (productId) => {
  socket.emit("deleteProduct", productId);
};

// Gestión de carga de producto por formulario

document.getElementById("formSection").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = document.getElementById("price").value;
  const status = document.getElementById("status").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  const thumbnail = document.getElementById("thumbnail").value;
  socket.emit("addProduct", {
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category,
    thumbnail: thumbnail,
  });
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("code").value = "";
  document.getElementById("price").value = "";
  document.getElementById("status").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("category").value = "";
  document.getElementById("thumbnail").value = "";
});

// Validación para se llenen los campos obligatorios del formulario

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".formProduct");
  const submitButton = form.querySelector('button[type="submit"]');
  const requiredFields = form.querySelectorAll(
    'input[name="title"], input[name="description"], input[name="code"], input[name="price"], input[name="stock"], input[name="category"]'
  );

  function checkFields() {
    let allFieldsFilled = true;
    requiredFields.forEach((field) => {
      if (field.value.trim() === "") {
        allFieldsFilled = false;
      }
    });

    submitButton.disabled = !allFieldsFilled;
  }

  requiredFields.forEach((field) => {
    field.addEventListener("input", checkFields);
  });

  checkFields();
});

