/* ============================= */
/* CONFIG */
/* ============================= */
const sheetID = "1nXx_KqKu24-1GHDwmC-A5R-XmLQLxUPPBLciPC73aOc"
const URL_JSON = `https://opensheet.elk.sh/${sheetID}/1`;
const WHATSAPP_GLOBAL = "573126161008"; // 👈 tu número aquí
const cloudName = "dvzdwcr5m";

/* ============================= */
/* INIT GLOBAL */
/* ============================= */
document.addEventListener("DOMContentLoaded", () => {

  cargarObras();
  activarScrollSuave();
  iniciarMenu();

});


/* ============================= */
/* MENU */
/* ============================= */
function iniciarMenu(){

  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  if(!menuToggle || !nav) return;

  const overlay = document.querySelector(".menu-overlay");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  function cerrarMenu(){
    nav.classList.remove("active");
    overlay.classList.remove("active");
  }

  // 👇 AQUÍ ESTÁ LA MAGIA
  document.querySelectorAll(".navbari a").forEach(link => {
    link.addEventListener("click", () => {
      cerrarMenu();
    });
  });
    // 👉 CLICK FUERA
  document.addEventListener("click", (e) => {

    if (nav.classList.contains("active")) {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        cerrarMenu();
      }
    }

  });

}


/* ============================= */
/* CARGAR OBRAS */
/* ============================= */
async function cargarObras() {

  const contenedor = document.getElementById("grid-obras");

  if(!contenedor) return;

  contenedor.innerHTML = `<p style="text-align:center;">Cargando programación...</p>`;

  try {
    const response = await fetch(URL_JSON);

    if (!response.ok) throw new Error("Error al cargar JSON");

    const obras = await response.json();

    renderObras(obras);

  } catch (error) {
    console.error("❌ Error JSON:", error);

    contenedor.innerHTML = `
      <p style="color:red; text-align:center;">
        Error cargando la programación 😢
      </p>
    `;
  }
}


/* ============================= */
/* RENDER */
/* ============================= */
function renderObras(obras) {

  const contenedor = document.getElementById("grid-obras");

  if (!obras || obras.length === 0) {
    contenedor.innerHTML = `<p>No hay obras disponibles</p>`;
    return;
  }

  contenedor.innerHTML = "";

  obras.forEach(obra => {

    const mensaje = `Hola, quiero reservar:
🎭 Obra: ${obra.titulo}
🗓️ Fecha: ${obra.fecha}`;

    const linkWhatsApp = `https://wa.me/${WHATSAPP_GLOBAL}?text=${encodeURIComponent(mensaje)}`;

    const card = document.createElement("div");
    card.classList.add("card-obra");

    card.innerHTML = `
      <img src="https://res.cloudinary.com/${cloudName}/image/upload/w_600,q_auto,f_webp/${obra.imagen}" alt="${obra.titulo}">
      
      <div class="card-content">
        <h3>${obra.titulo}</h3>
        <p>${obra.descripcion}</p>
        <p class="fecha">${obra.fecha}</p>
        <p class="autor">Autor: ${obra.autor || "No disponible"}</p>

        <a href="${linkWhatsApp}" target="_blank" class="btn-reservar">
          Reservar
        </a>
      </div>
    `;

    contenedor.appendChild(card);
  });
}


/* ============================= */
/* SCROLL SUAVE */
/* ============================= */
function activarScrollSuave(){
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();

      const destino = document.querySelector(this.getAttribute("href"));

      if(destino){
        destino.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
}


/* ============================= */
/* DEBUG */
/* ============================= */
console.log("🎭 Script cargado correctamente");