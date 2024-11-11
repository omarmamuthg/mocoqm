const productosCarrito = {};
const style = document.createElement('style');
style.textContent = `
    .btn-aumentar, .btn-disminuir, .btn-eliminar {
        background-color: #4CAF50; color: white; border: none; padding: 5px 10px;
        cursor: pointer; border-radius: 4px; margin: 0 5px; font-size: 14px;
    }
    .btn-disminuir { background-color: #f44336; }
    .btn-eliminar { background-color: #FF5722; }
    #carrito, #carrito li, #totalCarrito, .ventanaFormulario, .ventanaCompra, .ventanaConfirmacion {
        font-family: Arial, sans-serif;
    }
    #contadorProductos {
        position: absolute; top: -5px; right: -10px; background-color: red;
        color: white; border-radius: 50%; padding: 2px 6px; font-size: 12px;
        font-weight: bold; display: none;
    }
    .ventanaFormulario, .ventanaCompra, .ventanaConfirmacion {
        display: none; position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%); background-color: white;
        padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        width: 300px;
    }
    .ventanaFormulario input, .ventanaFormulario button {
        width: 100%; padding: 10px; margin: 10px 0;
    }
    .ventanaFormulario label { font-weight: bold; display: block; margin-top: 10px; }


    .btn-aumentar, .btn-disminuir, .btn-eliminar {
        background-color: #4CAF50; color: white; border: none; padding: 5px 10px;
        cursor: pointer; border-radius: 4px; margin: 0 5px; font-size: 14px;
    }
    .btn-disminuir { background-color: #f44336; }
    .btn-eliminar { background-color: #FF5722; }
    #carrito, #carrito li, #totalCarrito, .ventanaFormulario, .ventanaCompra, .ventanaConfirmacion {
        font-family: Arial, sans-serif;
    }
    #contadorProductos {
        position: absolute; top: -5px; right: -10px; background-color: red;
        color: white; border-radius: 50%; padding: 2px 6px; font-size: 12px;
        font-weight: bold; display: none;
    }
    .ventanaFormulario, .ventanaCompra, .ventanaConfirmacion {
        display: none; position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%); background-color: white;
        padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        width: 300px;
    }
    .ventanaFormulario input, .ventanaFormulario button {
        width: 100%; padding: 10px; margin: 10px 0;
    }
    .ventanaFormulario label { font-weight: bold; display: block; margin-top: 10px; }

    /* Estilos adicionales para la ventana de confirmación */
    .ventanaConfirmacion {
        background-color: #f0f0f0; padding: 20px; border-radius: 8px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); font-size: 14px; color: #333;
    }
    .ventanaConfirmacion h2 {
        margin-top: 0; color: #4CAF50; font-size: 18px;
    }
    .ventanaConfirmacion ul {
        list-style-type: none; padding: 0; margin: 10px 0;
    }
    .ventanaConfirmacion li {
        padding: 5px 0; border-bottom: 1px solid #ddd;
    }
    .ventanaConfirmacion p {
        font-weight: bold; margin: 15px 0;
    }
    .ventanaConfirmacion button {
        padding: 8px 15px; border: none; cursor: pointer;
        border-radius: 5px; font-size: 14px;
    }
    #btnConfirmar { background-color: #4CAF50; color: white; }
    #btnCancelar { background-color: #f44336; color: white; margin-left: 10px; }

    /* Estilos adicionales para el botón Confirmar Compra */
    #btnConfirmarCompra {
        background-color: #2196F3; color: white; border: none;
        padding: 10px; font-size: 16px; font-weight: bold;
        border-radius: 8px; cursor: pointer; width: 100%;
        transition: background-color 0.3s;
    }
    #btnConfirmarCompra:hover {
        background-color: #1e88e5;
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
    const ventanaConfirmacion = document.createElement('div'); // Ventana de confirmación
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

    // Variables para almacenar los datos del cliente (Para boton de confirmar compra)
    let nombreCliente = '';
    let domicilioCliente = '';
    let tarjetaCliente = '';
    let correoCliente = '';

    // Función para generar factura dinámica
    function generarFactura() {
        console.log(productosCarrito);
        const carritoItems = obtenerProductosDelCarrito(productosCarrito);
        const datosCliente = obtenerDatosCliente();
        console.log(carritoItems);
        const itemsTabla = carritoItems.map((producto, index) => [
            index + 1,  // Número de la fila
            producto.nombre,  // Nombre del producto
            producto.cantidad,  // Cantidad
            producto.precio.toFixed(2),  // Precio unitario (con 2 decimales)
            (producto.precio * producto.cantidad).toFixed(2),  // Total por producto
            'MXN'
        ]);
    
        const props = {
            outputType: jsPDFInvoiceTemplate.OutputType.Save,
            returnJsPDFDocObject: true,
            fileName: "Factura",
            orientationLandscape: false,
            compress: true,
            logo: {
                src: "imagenes/mocoQM_Logo3.2.png",
                width: 50,
                height: 25,
            },
            business: {
                name: "MocoQM",
                address: "Ciudad Universitaria SN, San Nicolás de los Garza, NL",
                phone: "812-472-4490",
                email: "MocoQM@example.com",
            },
            contact: {
                label: "Factura de Venta"
            },
            invoice: {
                label: "Factura #: ",
                num: 19,
                invDate: "Fecha de generación: " + new Date().toLocaleDateString(),
                header: [{ title: "#" }, { title: "Producto" }, { title: "Cantidad" }, { title: "Precio Unitario" }, { title: "Total" }, { title: "Moneda" }],
                table: itemsTabla,
                additionalRows: [{
                    col1: "Subtotal:",
                    col2: `${calcularSubTotal(carritoItems).toFixed(2)} MXN`,
                    style: { fontSize: 14 }  
                },
                {
                    col1: "IVA:",
                    col2: "16%",
                    style: { fontSize: 14 }  
                },
                {
                    col1: "Total (IVA): ",
                    col2: `${calcularTotal(carritoItems).toFixed(2)} MXN`,
                    style: { fontSize: 14 } 
                }],
                invDescLabel: "Nota:",
                invDesc: "Gracias por su compra. Esta factura es un comprobante de la transacción realizada. Por favor, conserve este documento para cualquier referencia futura. Si tiene preguntas sobre su compra o necesita asistencia adicional, no dude en contactarnos.",
            },
            footer: {
                text: "Factura generada automáticamente. Sin firma requerida.",
            },
            pageEnable: true,
            pageLabel: "Pagina ",
        };
        console.log(props)
        var pdfObject = jsPDFInvoiceTemplate.default(props);
        console.log("PDF generado exitosamente: ", pdfObject);
    };
    
    function obtenerDatosCliente() { 
        const nombreCliente = document.getElementById('nombre').value; 
        const correoCliente = document.getElementById('correo').value; 
        return { nombre: nombreCliente, correo: correoCliente }; 
    }
    
    function obtenerProductosDelCarrito(productosCarrito) {
        if (Object.keys(productosCarrito).length === 0) {
            console.log("El carrito está vacío");
            return [];  // Retorna un array vacío si no hay productos
        }
        return Object.keys(productosCarrito).map((nombreProducto) => {
            const producto = productosCarrito[nombreProducto];
            return {
                nombre: producto.nombre,
                cantidad: producto.cantidad,
                precio: producto.precio
            };
        });
    };
    
    // Calcula el total de la factura
    function calcularSubTotal(carritoItems) {
        return carritoItems.reduce((total, item) => total + (item.precio  * item.cantidad), 0);
    };

     // Calcula el total de la factura con impuesto
     function calcularTotal(carritoItems) {
        return carritoItems.reduce((total, item) => total + ((item.precio * 1.16 ) * item.cantidad), 0);
    };

    ventanaConfirmacion.classList.add('ventanaConfirmacion');
    ventanaConfirmacion.innerHTML = `
        <h2>Confirmación de Productos</h2>
        <ul id="listaConfirmacion"></ul>
        <p id="totalConfirmacion"></p>
        <button id="btnConfirmar">Confirmar</button>
        <button id="btnCancelar">Cancelar</button>
    `;
    document.body.appendChild(ventanaConfirmacion);

    iconoCarrito.addEventListener('click', () => {
        const rect = iconoCarrito.getBoundingClientRect();
        carteleraCarrito.style.top = `${rect.bottom}px`;
        carteleraCarrito.style.right = `${window.innerWidth - rect.right}px`;
        carteleraCarrito.style.display = carteleraCarrito.style.display === 'none' || !carteleraCarrito.style.display ? 'block' : 'none';
        if (!Object.keys(productosCarrito).length) {
            carrito.innerHTML = '<li>No hay productos en el carrito</li>';
        }
    });

    function agregarProductoAlCarrito(boton) {
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));

    productosCarrito[id] = productosCarrito[id] 
        ? { ...productosCarrito[id], cantidad: productosCarrito[id].cantidad + 1 } 
        : { nombre, precio, cantidad: 1 };

    console.log(productosCarrito)
    actualizarCarrito();
}

botonesAgregar.forEach(boton => {
    boton.addEventListener('click', () => agregarProductoAlCarrito(boton));
});

    function actualizarCarrito() {
        carrito.innerHTML = '';
        let total = 0;
        const desgloseDiv = document.createElement('div');
        desgloseDiv.classList.add('desglose');
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
        carrito.appendChild(desgloseDiv);
        const iva = total * 0.16;
        const totalConIva = total + iva;

        desgloseDiv.innerHTML = `
        <p>Subtotal: $${total.toFixed(2)}</p>
        <p>IVA (16%): $${iva.toFixed(2)}</p>
    `;

        const totalCarrito = document.createElement('p');
        totalCarrito.textContent = `Total con IVA: $${totalConIva.toFixed(2)}`;
        carrito.appendChild(totalCarrito);

        const totalConImpuesto = total + (total * 0.16);
        totalCarrito.textContent = total ? `Total: $${totalConImpuesto.toFixed(2)}` : '';
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
            mostrarVentanaConfirmacion();
            carteleraCarrito.style.display = 'none';
        } else {
            alert('No hay productos en el carrito');
        }
    });

    function mostrarVentanaConfirmacion() {
        const listaConfirmacion = document.getElementById('listaConfirmacion');
        listaConfirmacion.innerHTML = '';
        let totalConfirmado = 0;
        for (const id in productosCarrito) {
            const { nombre, precio, cantidad } = productosCarrito[id];
            const li = document.createElement('li');
            li.textContent = `${nombre} - $${precio} x ${cantidad}`;
            listaConfirmacion.appendChild(li);
            totalConfirmado += precio * cantidad;
        }
        document.getElementById('totalConfirmacion').textContent = `Total: $${(totalConfirmado * 1.16).toFixed(2)}`;
        ventanaConfirmacion.style.display = 'block';
    }

    document.getElementById('btnConfirmar').addEventListener('click', () => {
        ventanaConfirmacion.style.display = 'none';
        ventanaFormulario.style.display = 'block';
    });

    document.getElementById('btnCancelar').addEventListener('click', () => {
        ventanaConfirmacion.style.display = 'none';
    });

    btnConfirmarCompra.addEventListener('click', () => {

        nombreCliente = document.getElementById('nombre').value;
        domicilioCliente = document.getElementById('domicilio').value;
        tarjetaCliente = document.getElementById('tarjeta').value;
        correoCliente = document.getElementById('correo').value;

        if (!validarFormulario()) return;
        ventanaFormulario.style.display = 'none';
        ventanaCompra.style.display = 'block';
        limpiarFormulario();
    });

    cerrarFormulario.addEventListener('click', () => {
        ventanaFormulario.style.display = 'none';
        limpiarFormulario();
    });

    cerrarVentana.addEventListener('click', () => {
        ventanaCompra.style.display = 'none';
        vaciarCarrito();
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
    //const correoRegex = /^[a-zA-Z0-9._%+-]+@(hotmail\.com|gmail\.com|yahoo\.com|outlook\.com)$/;
      const correoRegex = /^[a-z0-9._%+-]+@(hotmail\.com|gmail\.com|yahoo\.com|outlook\.com)$/i;

      
  
      if (!nombre || !domicilio || tarjeta.length !== 16 || !correoRegex.test(correo)) {
          alert('Por favor completa todos los campos correctamente.');
          return false;
      }
      return true;
  }

  const botonGenerarFactura = document.getElementById("generarFactura");
    if (botonGenerarFactura) {
        botonGenerarFactura.addEventListener("click", generarFactura);
        console.log("Evento click de GenerarFactura configurado");
    }

    const botonCerrarVentana = document.getElementById("cerrarVentana");
    if (botonCerrarVentana) {
        botonCerrarVentana.addEventListener("click", cerrarVentana)};

});