document.addEventListener('DOMContentLoaded', function() {
  const limitSelect = document.getElementById('limitSelect');
  const sortSelect = document.getElementById('sort');

  // Restaurar valores seleccionados de localStorage
  const savedLimit = localStorage.getItem('selectedLimit');
  const savedSort = localStorage.getItem('selectedSort');

  if (savedLimit) {
    limitSelect.value = savedLimit;
  }
  if (savedSort) {
    sortSelect.value = savedSort;
  }

  // Actualizar URL y guardar en localStorage al cambiar el límite
  limitSelect.addEventListener('change', function() {
    const limit = this.value;
    const sort = sortSelect.value;

    localStorage.setItem('selectedLimit', limit);
    updateUrl(limit, sort);
  });

  // Actualizar URL y guardar en localStorage al cambiar el orden
  sortSelect.addEventListener('change', function() {
    const sort = this.value;
    const limit = limitSelect.value;

    localStorage.setItem('selectedSort', sort);
    updateUrl(limit, sort);
  });

  // Función para actualizar la URL
  function updateUrl(limit, sort) {
    const url = new URL(window.location.href);
    url.searchParams.set('limit', limit);
    if (sort) {
      url.searchParams.set('sort', sort);
    } else {
      url.searchParams.delete('sort');
    }
    window.location.href = url.toString();
  }
});

// Carrito





document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.getAttribute('data-id');
      const cartSelect = document.getElementById(`cartSelect-${productId}`);
      const cartId = cartSelect.value;

      try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        if (response.ok) {
          alert(`Producto ${productId} añadido al carrito correctamente al carrito${cartId}.`);
        } else {
          alert(`Error al añadir el producto al carrito: ${result.message}`);
        }
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un error al agregar el producto al carrito.');
      }
    });
  });
//Crear carrito
const newCart = document.getElementById('createCart');

newCart.addEventListener('click', async (e) => {
  try {
    const response = await fetch(`/api/carts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (response.ok) {
      alert('Carrito creado correctamente');
      window.location.reload();
    } else {
      alert(`Error al crear el carrito: ${result.message}`);
    }
  } catch (error) {
    console.error('Error al crear el carrito.', error);
    alert('Hubo un error al crear el carrito.');
  }
});


});

