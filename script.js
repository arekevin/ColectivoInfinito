/* ============================= */
/* CONFIG */
/* ============================= */

const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTyStjv4icl3Pbl3_gh3_oHn3Q_79w9dN-Apsur9Pi0Ff2GbnbZo31c1JLQqOAoq_jrQ0KkhZIHN_Z1/pub?gid=0&single=true&output=csv";
const cloudName = "dvzdwcr5m";
const numeroWhatsApp = "573126161008";

let productosGlobal = [];
let productosFiltrados = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let paginaActual = 1;
const productosPorPagina = 8;


/* ============================= */
/* UTILIDADES */
/* ============================= */

const formatoPrecio = num => `$${num.toLocaleString()}`;

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}


/* ============================= */
/* CARGAR PRODUCTOS */
/* ============================= */

async function fetchProductos() {
  const res = await fetch(sheetURL);
  const csvText = await res.text();

  const lines = csvText.trim().split("\n");
  const headers = lines.shift().split(",");

  return lines.map((line, index) => {
    const values = line.split(",");
    let obj = {};

    headers.forEach((h, i) => {
      obj[h.trim()] = values[i]?.trim();
    });

    obj.id = index;
    obj.Precio = parseInt(obj.Precio);

    return obj;
  });
}


/* ============================= */
/* MOSTRAR PRODUCTOS */
/* ============================= */

function mostrarProductos(coleccion = "todas") {

  document.getElementById("estudioCreativo").style.display = "none";

  productosFiltrados = coleccion === "todas"
    ? productosGlobal
    : productosGlobal.filter(p => p.Coleccion === coleccion);

  paginaActual = 1;
  renderPagina();
}

function renderPagina() {

  const cont = document.getElementById("productos");
  cont.innerHTML = "";

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productosFiltrados.slice(inicio, fin);

  productosPagina.forEach(p => {

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img 
        src="https://res.cloudinary.com/${cloudName}/image/upload/w_600,q_auto,f_webp/${p.Imagen}" 
        alt="${p.Nombre}"
        class="img-producto"
      >
      <h3>${p.Nombre}</h3>
      <div class="precio">${formatoPrecio(p.Precio)}</div>
      <button class="btn-agregar">Agregar al carrito</button>
    `;

    card.querySelector(".img-producto")
      .addEventListener("click", () => abrirModal(p.Imagen));

    card.querySelector(".btn-agregar")
      .addEventListener("click", function () {
        agregarAlCarrito(p, this);
      });

    cont.appendChild(card);
  });

  document.getElementById("paginaActual").textContent = paginaActual;
}


/* ============================= */
/* PAGINACIÓN */
/* ============================= */

function paginaSiguiente() {
  if (paginaActual * productosPorPagina < productosFiltrados.length) {
    paginaActual++;
    renderPagina();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function paginaAnterior() {
  if (paginaActual > 1) {
    paginaActual--;
    renderPagina();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}


/* ============================= */
/* FILTROS */
/* ============================= */

document.addEventListener("DOMContentLoaded", () => {

  const botones = document.querySelectorAll(".colecciones button");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {

      botones.forEach(btn => btn.classList.remove("active"));
      boton.classList.add("active");

      mostrarProductos(boton.dataset.categoria);
    });
  });

});


/* ============================= */
/* MODAL */
/* ============================= */

function abrirModal(imagenPublicId) {
  const modal = document.getElementById("modalImagen");
  const img = document.getElementById("imagenGrande");

  img.src = `https://res.cloudinary.com/${cloudName}/image/upload/w_1200,q_auto,f_webp/${imagenPublicId}`;
  modal.classList.add("activo");
}

function cerrarModal() {
  document.getElementById("modalImagen").classList.remove("activo");
}


/* ============================= */
/* CARRITO */
/* ============================= */

function agregarAlCarrito(producto, boton) {

  const existente = carrito.find(p => p.id === producto.id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      Nombre: producto.Nombre,
      Precio: producto.Precio,
      Imagen: producto.Imagen,
      cantidad: 1
    });
  }

  guardarCarrito();
  actualizarCarritoUI();
  mostrarToast();

  /* Animación botón */
  if (boton) {
    const textoOriginal = boton.innerText;

    boton.classList.add("agregado");
    boton.innerText = "Agregado ✓";
    boton.disabled = true;

    setTimeout(() => {
      boton.classList.remove("agregado");
      boton.innerText = textoOriginal;
      boton.disabled = false;
    }, 1500);
  }
}

function eliminarProducto(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
  actualizarCarritoUI();
}

function cambiarCantidad(id, cambio) {

  const item = carrito.find(p => p.id === id);
  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    eliminarProducto(id);
  } else {
    guardarCarrito();
    actualizarCarritoUI();
  }
}


/* ============================= */
/* UI CARRITO */
/* ============================= */

function actualizarCarritoUI() {

  const lista = document.getElementById("listaCarrito");
  const contador = document.getElementById("contadorCarrito");
  const totalSpan = document.getElementById("totalCarrito");

  lista.innerHTML = "";

  let total = 0;
  let totalItems = 0;

  carrito.forEach(item => {

    total += item.Precio * item.cantidad;
    totalItems += item.cantidad;

    const div = document.createElement("div");
    div.classList.add("item-carrito");

    div.innerHTML = `
      <img src="https://res.cloudinary.com/${cloudName}/image/upload/w_200,q_auto,f_webp/${item.Imagen}" alt="${item.Nombre}">
      
      <div class="item-info">
        <h4>${item.Nombre}</h4>
        <div class="precio">${formatoPrecio(item.Precio * item.cantidad)}</div>

        <div class="controles-cantidad">
          <button onclick="cambiarCantidad(${item.id}, -1)">−</button>
          <span>${item.cantidad}</span>
          <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
        </div>

        <button class="btn-eliminar" onclick="eliminarProducto(${item.id})">
          Eliminar
        </button>
      </div>
    `;

    lista.appendChild(div);
  });

  contador.textContent = totalItems;
  totalSpan.textContent = total.toLocaleString();
}


/* ============================= */
/* PANEL CARRITO */
/* ============================= */

function abrirCarrito() {
  document.getElementById("carritoPanel").classList.add("activo");
  document.getElementById("carritoOverlay").classList.add("activo");
}

function cerrarCarrito() {
  document.getElementById("carritoPanel").classList.remove("activo");
  document.getElementById("carritoOverlay").classList.remove("activo");
}


/* ============================= */
/* WHATSAPP */
/* ============================= */

function enviarPedidoWhatsApp() {

  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let mensaje = "Hola Foxlab Co 👋\n\nQuiero hacer el siguiente pedido:\n\n";
  let total = 0;

  carrito.forEach(item => {

    const subtotal = item.Precio * item.cantidad;

    mensaje += `• ${item.Nombre}\n`;
    mensaje += `  Cantidad: ${item.cantidad}\n`;
    mensaje += `  Subtotal: ${formatoPrecio(subtotal)}\n\n`;

    total += subtotal;
  });

  mensaje += `Total: ${formatoPrecio(total)}\n\nMi nombre es:`;

  const mensajeCodificado = encodeURIComponent(mensaje);
  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`, "_blank");
// 🔥 VACIAR CARRITO DESPUÉS DE ENVIAR
  carrito = [];
  localStorage.removeItem("carrito");
  actualizarCarritoUI();
  cerrarCarrito();
}


/* ============================= */
/* INICIALIZAR */
/* ============================= */

(async function init() {
  try {
    productosGlobal = await fetchProductos();
    productosFiltrados = [...productosGlobal];
    renderPagina();
    actualizarCarritoUI();
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
})();