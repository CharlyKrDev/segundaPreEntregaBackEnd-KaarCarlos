document.addEventListener('DOMContentLoaded', () => {
    // Obtener el botón para vaciar el carrito
    const emptyCart = document.getElementById('emptyCart');

if (emptyCart) {

      // Agregar un event listener al botón para vaciar el carrito
      emptyCart.addEventListener('click', async () => {
        // Obtener el ID del carrito desde el atributo 'data-id' del botón
        const cartId = emptyCart.getAttribute('data-id');

        // Confirmar si el usuario desea vaciar el carrito
        const confirmed = window.confirm(`¿Estás seguro de eliminar el carrito con todos sus productos?`);
        if (!confirmed) return; // Si el usuario cancela, no hacemos nada

        try {
            // Enviar una solicitud DELETE para vaciar el carrito
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Leer la respuesta del servidor
            const result = await response.json();
            if (response.ok) {
                // Si la solicitud se completó correctamente, mostrar un mensaje de éxito y redirigir a la página de productos
                alert(`Carrito eliminado`);
                window.location.href = "http://localhost:8080/products";
            } else {
                // Si hubo un error, mostrar un mensaje de error
                alert(`Error al eliminar el carrito: ${result.message}`);
            }
        } catch (error) {
            // Capturar y manejar cualquier error durante la solicitud
            console.error('Error al enviar la solicitud:', error);
            alert('Error al eliminar el carrito.');
        }
    });
}
  

    // Obtener todos los botones para eliminar productos del carrito
    document.querySelectorAll('.deleteFromCart').forEach(button => {
        // Agregar un event listener a cada botón
        button.addEventListener('click', async (event) => {
            // Obtener el ID del producto desde el atributo 'data-id' del botón
            const productId = event.target.getAttribute('data-id');

            // Confirmar si el usuario desea eliminar el producto del carrito
            const confirmed = window.confirm(`¿Estás seguro de eliminar este producto del carrito?`);
            if (!confirmed) return; // Si el usuario cancela, no hacemos nada

            try {
                // Obtener el ID del carrito
                const cart = document.getElementById("emptyCart");
                const cartId = cart.getAttribute('data-id');

                // Enviar una solicitud DELETE para eliminar el producto del carrito
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Leer la respuesta del servidor
                const result = await response.json();
                if (response.ok) {
                    // Si la solicitud se completó correctamente, mostrar un mensaje de éxito y recargar la página
                    alert(`1 producto eliminado del carrito correctamente.`);
                    window.location.reload();
                } else {
                    // Si hubo un error, mostrar un mensaje de error
                    alert(`Error al eliminar producto del carrito: ${result.message}`);
                }
            } catch (error) {
                // Capturar y manejar cualquier error durante la solicitud
                console.error('Error al enviar la solicitud:', error);
                alert('Hubo un error al eliminar el producto del carrito.');
            }
        });
    });
});
