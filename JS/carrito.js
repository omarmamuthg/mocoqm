const style = document.createElement('style');
style.textContent = `
  .btn-aumentar, .btn-disminuir, .btn-eliminar {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
    margin: 0 5px;
    font-size: 14px;
  }
  .btn-disminuir { background-color: #f44336; }
  .btn-eliminar { background-color: #FF5722; }
  #carrito, #carrito li, #totalCarrito, .ventanaFormulario, .ventanaCompra {
    font-family: Arial, sans-serif;
  }
  #contadorProductos {
    position: absolute;
    top: -5px;
    right: -10px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
    display: none;
  }
  .ventanaFormulario, .ventanaCompra {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    width: 300px;
  }
  .ventanaFormulario input, .ventanaFormulario button {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
  }
  .ventanaFormulario label {
    font-weight: bold;
    display: block;
    margin-top: 10px;
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  const botonesAgregar = document.querySelectorAll('.btn[data-id]');
  const carrito = document.getElementById('carrito');
  const totalCarrito = document.getElementById('totalCarrito');
  const btnComprar = document.getElementById('btnComprar');
  const ventanaFormulario = document.getElementById('ventanaFormulario');
  const ventanaCompra = document.getElementById('ventanaCompra');
  const cerrarVentana = document.getElementById('cerrarVentana');
  const iconoCarrito = document.getElementById('iconoCarrito');
  const carteleraCarrito = document.getElementById('carteleraCarrito');
  const cerrarFormulario = document.getElementById('cerrarFormulario');
  const btnConfirmarCompra = document.getElementById('btnConfirmarCompra');
  const nombreInput = document.getElementById('nombre');
  const domicilioInput = document.getElementById('domicilio');
  const tarjetaInput = document.getElementById('tarjeta');
  const correoInput = document.getElementById('correo');

  const contadorProductos = document.createElement('span');
  contadorProductos.id = 'contadorProductos';
  iconoCarrito.appendChild(contadorProductos);

  const productosCarrito = {};

  iconoCarrito.addEventListener('click', () => {
    const rect = iconoCarrito.getBoundingClientRect();
    carteleraCarrito.style.top = `${rect.bottom}px`;
    carteleraCarrito.style.right = `${window.innerWidth - rect.right}px`;
    carteleraCarrito.style.display = carteleraCarrito.style.display === 'none' || !carteleraCarrito.style.display ? 'block' : 'none';
    if (!Object.keys(productosCarrito).length) {
      carrito.innerHTML = '<li>No hay productos en el carrito</li>';
    }
  });

  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', () => {
      const id = boton.getAttribute('data-id');
      const nombre = boton.getAttribute('data-nombre');
      const precio = parseFloat(boton.getAttribute('data-precio'));
      productosCarrito[id] = productosCarrito[id] ? { ...productosCarrito[id], cantidad: productosCarrito[id].cantidad + 1 } : { nombre, precio, cantidad: 1 };
      actualizarCarrito();
    });
  });

  function actualizarCarrito() {
    carrito.innerHTML = '';
    let total = 0;
    for (const id in productosCarrito) {
      const { nombre, precio, cantidad } = productosCarrito[id];
      const nuevoLi = document.createElement('li');
      nuevoLi.innerHTML = `${nombre} - $${precio} x ${cantidad}`;

      const botonAumentar = crearBoton('btn-aumentar', '+', () => {
        productosCarrito[id].cantidad += 1;
        actualizarCarrito();
      });

      const botonDisminuir = crearBoton('btn-disminuir', '-', () => {
        productosCarrito[id].cantidad > 1 ? productosCarrito[id].cantidad -= 1 : delete productosCarrito[id];
        actualizarCarrito();
      });

      const botonEliminar = crearBoton('btn-eliminar', 'Eliminar', () => eliminarProducto(id));

      [botonAumentar, botonDisminuir, botonEliminar].forEach(boton => nuevoLi.appendChild(boton));
      carrito.appendChild(nuevoLi);
      total += precio * cantidad;
    }
    totalCarrito.textContent = total ? `Total: $${total.toFixed(2)}` : '';
    actualizarContadorCarrito();
    if (!Object.keys(productosCarrito).length) {
      carrito.innerHTML = '<li>No hay productos en el carrito</li>';
    }
  }

  function crearBoton(clase, texto, evento) {
    const boton = document.createElement('button');
    boton.textContent = texto;
    boton.classList.add(clase);
    boton.addEventListener('click', evento);
    return boton;
  }

  function actualizarContadorCarrito() {
    const cantidadArticulos = Object.keys(productosCarrito).length;
    contadorProductos.textContent = cantidadArticulos;
    contadorProductos.style.display = cantidadArticulos ? 'block' : 'none';
  }

  function eliminarProducto(id) {
    delete productosCarrito[id];
    actualizarCarrito();
  }

  btnComprar.addEventListener('click', () => {
    if (Object.keys(productosCarrito).length) {
      ventanaFormulario.style.display = 'block';
      carteleraCarrito.style.display = 'none';
    } else {
      alert('No hay productos en el carrito');
    }
  });

  btnConfirmarCompra.addEventListener('click', () => {
    if (!validarFormulario()) return;
    ventanaFormulario.style.display = 'none';
    ventanaCompra.style.display = 'block';
    vaciarCarrito();
    limpiarFormulario();
  });

  cerrarFormulario.addEventListener('click', () => {
    ventanaFormulario.style.display = 'none';
    limpiarFormulario();
  });

  cerrarVentana.addEventListener('click', () => {
    ventanaCompra.style.display = 'none';
  });

  function limpiarFormulario() {
    nombreInput.value = '';
    domicilioInput.value = '';
    tarjetaInput.value = '';
    correoInput.value = '';
  }

  function vaciarCarrito() {
    Object.keys(productosCarrito).forEach(id => delete productosCarrito[id]);
    actualizarCarrito();
  }

  function validarFormulario() {
    const nombre = nombreInput.value.trim();
    const domicilio = domicilioInput.value.trim();
    const tarjeta = tarjetaInput.value.trim();
    const correo = correoInput.value.trim();
    if (!nombre || !domicilio || tarjeta.length !== 16 || !correo.includes('@')) {
      alert('Por favor completa todos los campos correctamente.');
      return false;
    }
    return true;
  }
});
