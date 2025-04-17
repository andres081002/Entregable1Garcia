const productosContainer = document.getElementById("productos-container");
const carritoContainer = document.getElementById("carrito-container");
const resumenCarrito = document.getElementById("resumen-carrito");
const cantidadItemsCarrito = document.getElementById("cantidad-items-carrito");
const totalCarrito = document.getElementById("total-carrito");
const verCarritoBtn = document.getElementById("ver-carrito");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let ganancias = 0;
let productos = [];

function cargarProductos() {
  fetch('js/data.json')
    .then(response => response.json())
    .then(data => {
      productos = data;
      crearCards();
    })
    .catch(error => {
      productosContainer.innerHTML = "<p>Error al cargar los productos.</p>";
    });
}

function crearCards() {
  productosContainer.innerHTML = "";
  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${producto.nombre}</h3>
      <img src="${producto.imagen}" alt="${producto.nombre}" width="100">
      <p>Precio: ${producto.precio}</p>
      <p>Stock: ${producto.cantidad}</p>
      <button class="agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
    `;
    productosContainer.appendChild(card);
  });
}

function actualizarCarrito() {
  carritoContainer.innerHTML = "<h2>Carrito de Compras</h2>";
  if (carrito.length === 0) {
    carritoContainer.innerHTML += "<p>El carrito está vacío.</p>";
  } else {
    const carritoAgrupado = {};
    carrito.forEach(producto => {
      carritoAgrupado[producto.id] = (carritoAgrupado[producto.id] || 0) + 1;
    });

    for (const productoId in carritoAgrupado) {
      const producto = productos.find(p => p.id === parseInt(productoId));
      const cantidad = carritoAgrupado[productoId];
      if (producto) {
        const item = document.createElement("div");
        item.classList.add("carrito-item");
        item.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" width="50">
          <span>${producto.nombre}</span>
          <span>Precio: $${producto.precio.toLocaleString('es-AR')}</span>
          <span>Cantidad: <input type="number" class="cantidad-carrito" data-id="${producto.id}" value="${cantidad}" min="1"></span>
          <button class="eliminar-carrito" data-id="${producto.id}">Eliminar</button>
        `;
        carritoContainer.appendChild(item);
      }
    }
    carritoContainer.innerHTML += '<button id="comprar-carrito">Comprar</button>';
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarResumenCarrito();
}

function agregarAlCarrito(productoId) {
  const producto = productos.find((p) => p.id === productoId);
  if (producto) {
    carrito.push(producto);
    actualizarCarrito();
    Swal.fire({
      title: '¡Producto añadido!',
      text: `${producto.nombre} se ha añadido al carrito.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  }
}

function eliminarDelCarrito(productoId) {
  carrito = carrito.filter(producto => producto.id !== productoId);
  actualizarCarrito();
  const productoEliminado = productos.find(p => p.id === productoId);
  if (productoEliminado) {
    Swal.fire({
      title: '¡Producto eliminado!',
      text: `${productoEliminado.nombre} se ha eliminado del carrito.`,
      icon: 'warning',
      timer: 1500,
      showConfirmButton: false,
    });
  }
}

function comprarCarrito() {
  if (carrito.length > 0) {
    let carritoResumen = '<ul>';
    let total = 0;
    const carritoAgrupado = {};
    carrito.forEach(item => {
      carritoAgrupado[item.id] = (carritoAgrupado[item.id] || 0) + 1;
    });

    for (const productoId in carritoAgrupado) {
      const producto = productos.find(p => p.id === parseInt(productoId));
      if (producto) {
        const cantidad = carritoAgrupado[productoId];
        carritoResumen += `<li>${producto.nombre} x ${cantidad} - Precio: $${producto.precio * cantidad}</li>`;
        total += producto.precio * cantidad;
      }
    }
    carritoResumen += `</ul><p>Total: $${total.toLocaleString('es-AR')}</p>`;

    Swal.fire({
      title: 'Resumen del Carrito',
      html: carritoResumen,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Continuar al Pago',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Información de Envío',
          text: 'Por favor, ingresa tu dirección de envío (simulado):',
          input: 'text',
          showCancelButton: true,
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Volver',
          inputValidator: (value) => {
            if (!value) {
              return '¡Debes ingresar una dirección!';
            }
          }
        }).then((envioResult) => {
          if (envioResult.isConfirmed && envioResult.value) {
            const direccionEnvio = envioResult.value;
            Swal.fire({
              title: 'Seleccionar Método de Pago',
              input: 'radio',
              inputOptions: {
                'tarjetadecredito': '<img src="img/mastercard.png" alt="Tarjeta de Crédito" style="width: 50px; vertical-align: middle; margin-right: 10px;">Tarjeta de Crédito',
                'mercadopago': '<img src="img/mercado-pago.jpg" alt="Mercado Pago" style="width: 50px; vertical-align: middle; margin-right: 10px;">Mercado Pago',
                'transferencia': '<img src="img/transferencia.jpg" alt="Transferencia" style="width: 50px; vertical-align: middle; margin-right: 10px;">Transferencia Bancaria'
              },
              showCancelButton: true,
              confirmButtonText: 'Continuar',
              cancelButtonText: 'Volver',
              inputValidator: (value) => {
                if (!value) {
                  return '¡Debes seleccionar un método de pago!';
                }
              }
            }).then((pagoResult) => {
              if (pagoResult.isConfirmed && pagoResult.value) {
                const metodoPago = pagoResult.value;
                let detallesPagoHtml = '';
                let tituloDetallesPago = '';
                let placeholderAlias = 'Alias de Mercado Pago (simulado)';
                if (metodoPago === 'tarjetadecredito') {
                  tituloDetallesPago = 'Tarjeta de Crédito';
                  placeholderAlias = '';
                  detallesPagoHtml = '<input type="text" placeholder="Número de Tarjeta (simulado)"><br><input type="text" placeholder="Fecha de Vencimiento (MM/AA)"><br><input type="text" placeholder="CVV">';
                } else if (metodoPago === 'mercadopago') {
                  tituloDetallesPago = 'Mercado Pago';
                  detallesPagoHtml = '<input type="text" placeholder="' + placeholderAlias + '">';
                } else if (metodoPago === 'transferencia') {
                  tituloDetallesPago = 'Transferencia Bancaria';
                  placeholderAlias = '';
                  detallesPagoHtml = '<p>Por favor, realiza una transferencia a la siguiente cuenta (simulado).</p>';
                }

                Swal.fire({
                  title: `Detalles de Pago (${tituloDetallesPago})`,
                  html: detallesPagoHtml,
                  showCancelButton: true,
                  confirmButtonText: 'Pagar',
                  cancelButtonText: 'Volver',
                  preConfirm: () => {
                    const swalContent = Swal.getHtmlContainer();

                    const numeroTarjeta = swalContent.querySelector('input[placeholder*="Número de Tarjeta"]');
                    const fechaVencimiento = swalContent.querySelector('input[placeholder*="Fecha de Vencimiento"]');
                    const cvv = swalContent.querySelector('input[placeholder*="CVV"]');
                    const aliasMercadoPago = swalContent.querySelector('input[placeholder*="Alias de Mercado Pago"]');

                    if (metodoPago === 'tarjetadecredito') {
                      if (!numeroTarjeta || numeroTarjeta.value.length < 16) {
                        Swal.showValidationMessage('Por favor, ingresa un número de tarjeta válido (simulado).');
                        return false;
                      }
                      if (!fechaVencimiento || !/^\d{2}\/\d{2}$/.test(fechaVencimiento.value)) {
                        Swal.showValidationMessage('Por favor, ingresa una fecha de vencimiento válida (MM/AA).');
                        return false;
                      }
                      if (!cvv || cvv.value.trim() === '') {
                        Swal.showValidationMessage('Por favor, ingresa el CVV.');
                        return false;
                      }
                    } else if (metodoPago === 'mercadopago') {
                      if (!aliasMercadoPago || aliasMercadoPago.value.trim() === '') {
                        Swal.showValidationMessage('Por favor, ingresa tu alias de Mercado Pago (simulado).');
                        return false;
                      }
                    }
                    return true;
                  }
                }).then((confirmacionPago) => {
                  if (confirmacionPago.isConfirmed) {
                    Swal.fire({
                      title: 'Procesando Pago...',
                      html: '<div class="loader"></div>',
                      showConfirmButton: false,
                      allowOutsideClick: false,
                      timer: 2000
                    }).then(() => {
                      ganancias += total;
                      carrito = [];
                      localStorage.setItem("carrito", JSON.stringify(carrito));
                      actualizarCarrito();
                      Swal.fire('¡Pago Exitoso!', `Tu compra de $${total.toLocaleString('es-AR')} ha sido realizada. ¡Gracias!`, 'success');
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    Swal.fire('Carrito vacío', 'No hay productos en el carrito para comprar.', 'info');
  }
}

function actualizarResumenCarrito() {
  cantidadItemsCarrito.textContent = carrito.length;
  let total = 0;
  carrito.forEach(item => total += item.precio);
  totalCarrito.textContent = total.toLocaleString('es-AR');
}

verCarritoBtn.addEventListener("click", () => {
  carritoContainer.classList.toggle("oculto");
});

productosContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("agregar-carrito")) {
    const productoId = parseInt(event.target.dataset.id);
    agregarAlCarrito(productoId);
  }
});

carritoContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("eliminar-carrito")) {
    const productoId = parseInt(event.target.dataset.id);
    eliminarDelCarrito(productoId);
  } else if (event.target.id === "comprar-carrito") {
    comprarCarrito();
  }
});

carritoContainer.addEventListener("change", (event) => {
  if (event.target.classList.contains("cantidad-carrito")) {
    const productoId = parseInt(event.target.dataset.id);
    const nuevaCantidad = parseInt(event.target.value);

    if (nuevaCantidad > 0) {
      carrito = carrito.filter(item => item.id !== productoId);
      for (let i = 0; i < nuevaCantidad; i++) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
          carrito.push(producto);
        }
      }
      actualizarCarrito();
    }
  }
});

cargarProductos();
actualizarCarrito();
actualizarResumenCarrito();