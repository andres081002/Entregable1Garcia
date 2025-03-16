const productos = [
    { nombre: "Mortal Kombat", precio: 15000, genero: "Peleas", cantidad: 100, id: 1, imagen: "img/mk1-ultimate-series-x.jpg" },
    { nombre: "Mario Kart", precio: 20000, genero: "Carreras", cantidad: 25, id: 2, imagen: "img/mariok.gif" },
    { nombre: "The Legend of Zelda", precio: 25000, genero: "Aventura", cantidad: 30, id: 3, imagen: "img/the-legend-of-zelda-tears-of-the-kingdom.jpg" },
  ];
  
  const productosContainer = document.getElementById("productos-container");
  const carritoContainer = document.getElementById("carrito-container");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let ganancias = 0;
  
  function crearCards() {
    productosContainer.innerHTML = "";
    productos.forEach((producto) => {
      const card = document.createElement("div");
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
    carritoContainer.innerHTML = "<h2>Carrito:</h2>";
    if (carrito.length === 0) {
      carritoContainer.innerHTML += "<p>El carrito está vacío.</p>";
    } else {
      carrito.forEach((producto, index) => {
        const item = document.createElement("div");
        item.innerHTML = `
          ${producto.nombre} - Precio: ${producto.precio}
          <button class="eliminar-carrito" data-index="${index}">Eliminar</button>
        `;
        carritoContainer.appendChild(item);
      });
      carritoContainer.innerHTML += '<button id="comprar-carrito">Comprar</button>';
      document.getElementById("comprar-carrito").addEventListener("click", comprarCarrito);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  
  function agregarAlCarrito(productoId) {
    const producto = productos.find((p) => p.id === productoId);
    if (producto) {
      carrito.push(producto);
      actualizarCarrito();
    }
  }
  
  function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
  }
  
  function comprarCarrito() {
    if (carrito.length > 0) {
      if (confirm("¿Confirmar compra?")) {
        carrito.forEach((producto) => {
          ganancias += producto.precio;
        });
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
        console.log(`Ganancias totales: $${ganancias}`);
      }
    } else {
      alert("El carrito está vacío.");
    }
  }
  
  //evento para agregar al carrito
  productosContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("agregar-carrito")) {
      const productoId = parseInt(event.target.dataset.id);
      agregarAlCarrito(productoId);
    }
  });
  
  //evento para eliminar del carrito
  carritoContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("eliminar-carrito")) {
      const index = parseInt(event.target.dataset.index);
      eliminarDelCarrito(index);
    }
  });
  
  crearCards();
  actualizarCarrito();