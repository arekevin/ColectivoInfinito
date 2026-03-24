const carrusel = document.querySelector(".carrusel");

let scrollPos = 0;

setInterval(() => {

scrollPos += 320;

if(scrollPos >= carrusel.scrollWidth){

scrollPos = 0;

}

carrusel.scrollTo({

left: scrollPos,
behavior: "smooth"

});

}, 3000);
