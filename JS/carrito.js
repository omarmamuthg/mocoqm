document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll('.btn[data-id]');
    // Selecciona el carrito donde se van a agregar los productos
    const carrito = document.getElementById('carrito');
    
    // Objeto para almacenar los productos en el carrito
    const productosCarrito = {};

    // Función para agregar producto al carrito
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', () => {
            // Obtener los datos del producto desde los atributos del botón
            const id = boton.getAttribute('data-id');
            const nombre = boton.getAttribute('data-nombre');
            const precio = parseFloat(boton.getAttribute('data-precio'));

            // Si el producto ya está en el carrito, aumentar la cantidad
            if (productosCarrito[id]) {
                productosCarrito[id].cantidad += 1;
            } else {
                // Si no, agregar el producto con cantidad 1
                productosCarrito[id] = {
                    nombre: nombre,
                    precio: precio,
                    cantidad: 1
                };
            }

            // Actualizar la vista del carrito
            actualizarCarrito();
        });
    });

    // Función para actualizar la vista del carrito
    function actualizarCarrito() {
        // Limpiar el contenido actual del carrito
        carrito.innerHTML = '';
        
        // Iterar sobre los productos del carrito y crear elementos <li> para cada uno
        Object.keys(productosCarrito).forEach(id => {
            const producto = productosCarrito[id];
            
            // Crear un nuevo <li> para el producto en el carrito
            const nuevoLi = document.createElement('li');
            nuevoLi.innerHTML = `${producto.nombre} - $${producto.precio} x ${producto.cantidad}`;
            
            // Botón para eliminar el producto del carrito
            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.style.marginLeft = '10px';
            botonEliminar.addEventListener('click', () => {
                eliminarProducto(id);
            });

            // Agregar el botón eliminar al <li> y luego al carrito
            nuevoLi.appendChild(botonEliminar);
            carrito.appendChild(nuevoLi);
        });
    }

    // Función para eliminar un producto del carrito
    function eliminarProducto(id) {
        // Eliminar el producto del objeto productosCarrito
        delete productosCarrito[id];
        
        // Actualizar la vista del carrito
        actualizarCarrito();
    }
});
