const style = document.createElement('style');
style.textContent = `
  .btn-aumentar, .btn-disminuir, .btn-eliminar {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 22px;
    cursor: pointer;
  }

  .btn-disminuir {
    background-color: #f44336;
  }
`;

document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const botonesAgregar = document.querySelectorAll('.btn[data-id]');
    const carrito = document.getElementById('carrito');
    const totalCarrito = document.getElementById('totalCarrito');
    const btnComprar = document.getElementById('btnComprar');
    const ventanaCompra = document.getElementById('ventanaCompra');
    const cerrarVentana = document.getElementById('cerrarVentana');
    const iconoCarrito = document.getElementById('iconoCarrito');
    const carteleraCarrito = document.getElementById('carteleraCarrito');

    const productosCarrito = {};

    // Mostrar/Ocultar la cartelera al hacer clic en el ícono de carrito
    iconoCarrito.addEventListener('click', (event) => {
        // Posiciona la cartelera justo al lado del icono del carrito
        const rect = iconoCarrito.getBoundingClientRect();
        carteleraCarrito.style.top = `${rect.bottom}px`; 
        carteleraCarrito.style.right = `${window.innerWidth - rect.right}px`; 

        // Alterna la visibilidad de la cartelera
        carteleraCarrito.style.display = carteleraCarrito.style.display === 'none' || carteleraCarrito.style.display === '' ? 'block' : 'none';

        // Si no hay productos, mostrar un mensaje
        if (Object.keys(productosCarrito).length === 0) {
            carrito.innerHTML = '<li>No hay productos en el carrito</li>';
        }
    });

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.getAttribute('data-id');
            const nombre = boton.getAttribute('data-nombre');
            const precio = parseFloat(boton.getAttribute('data-precio'));

            if (productosCarrito[id]) {
                productosCarrito[id].cantidad += 1;
            } else {
                productosCarrito[id] = { nombre: nombre, precio: precio, cantidad: 1 };
            }
            actualizarCarrito();
        });
    });

    function vaciarCarrito() {
        for (let id in productosCarrito) {
            delete productosCarrito[id];
        }
        actualizarCarrito();
    }

    function actualizarCarrito() {

        document.head.appendChild(style);

        const botonAumentar = document.createElement('button');
        botonAumentar.textContent = '+';
        botonAumentar.classList.add('btn-aumentar'); // Agrega una clase para aplicar estilos

        const botonDisminuir = document.createElement('button');
        botonDisminuir.textContent = '-';
        botonDisminuir.classList.add('btn-disminuir'); // Agrega una clase para aplicar estilos

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.classList.add('btn-eliminar');
        carrito.innerHTML = '';
        let total = 0;

        Object.keys(productosCarrito).forEach(id => {
            const producto = productosCarrito[id];
            const nuevoLi = document.createElement('li');
            nuevoLi.innerHTML = `${producto.nombre} - $${producto.precio} x ${producto.cantidad}`;

            const botonAumentar = document.createElement('button');
            botonAumentar.textContent = '+';
            botonAumentar.style.marginLeft = '10px';
            botonAumentar.addEventListener('click', () => {
                productosCarrito[id].cantidad += 1;
                actualizarCarrito();
            });

            const botonDisminuir = document.createElement('button');
            botonDisminuir.textContent = '-';
            botonDisminuir.style.marginLeft = '10px';
            botonDisminuir.addEventListener('click', () => {
                if (productosCarrito[id].cantidad > 1) {
                    productosCarrito[id].cantidad -= 1;
                } else {
                    delete productosCarrito[id];
                }
                actualizarCarrito();
            });

            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.style.marginLeft = '10px';
            botonEliminar.addEventListener('click', () => {
                eliminarProducto(id);
            });

            nuevoLi.appendChild(botonAumentar);
            nuevoLi.appendChild(botonDisminuir);
            nuevoLi.appendChild(botonEliminar);
            carrito.appendChild(nuevoLi);
            total += producto.precio * producto.cantidad;
        });

        totalCarrito.textContent = `Total: $${total.toFixed(2)}`;

        if (Object.keys(productosCarrito).length === 0) {
            carrito.innerHTML = '<li>No hay productos en el carrito</li>';
            totalCarrito.textContent = '';
        }
    }

    function eliminarProducto(id) {
        delete productosCarrito[id];
        actualizarCarrito();
    }

    btnComprar.addEventListener('click', () => {
        if (Object.keys(productosCarrito).length > 0) {
            ventanaCompra.style.display = 'block';
            vaciarCarrito();
            carteleraCarrito.style.display = 'none'; // Oculta el carrito después de la compra
        } else {
            alert('No hay productos en el carrito');
        }
    });

    cerrarVentana.addEventListener('click', () => {
        ventanaCompra.style.display = 'none';
    });
});









