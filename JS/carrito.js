// Seleccionar todos los botones de agregar al carrito
const botonesAgregar = document.querySelectorAll('.btn[data-id]');

// Seleccionar el carrito donde se van a agregar los productos
const carrito = document.getElementById('carrito');

// Función para agregar producto al carrito
botonesAgregar.forEach(boton => {
  boton.addEventListener('click', (e) => {
    // Obtener los datos del producto desde los atributos del botón
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-nombre');
    const precio = boton.getAttribute('data-precio');

    // Crear un nuevo <li> para el carrito
    const nuevoLi = document.createElement('li');
    nuevoLi.textContent = `${nombre} - $${precio}`;

    // Agregar el nuevo <li> al carrito
    carrito.appendChild(nuevoLi);
  });
});