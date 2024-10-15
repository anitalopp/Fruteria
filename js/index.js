const frutas = [
    "pitahaya",
    "chirimoya",
    "longan",
    "carambola",
    "kiwano",
    "maracuya",
    "lichi",
    "physalis",
    "kumquat",
    "pawpaw"
];

const precios = [
    9.15,
    8.60,
    7.42,
    6.70,
    8.99,
    5.22,
    7.66,
    10.32,
    8.20,
    10.66
];

const cantidades = new Array(frutas.length).fill(0); 
let dineroGastado = 0;

function añadirFruta(fruta) {
    const i = frutas.indexOf(fruta);
    if (i !== -1) {
        cantidades[i] = cantidades[i] + 1;  
        dineroGastado = dineroGastado + precios[i]; 
    }
}



function mostrarResumen() {
    frutas.sort((a, b) => a < b);

    const resumenCompra = document.getElementById("resumenCompra");
    const totalPrecio = document.getElementById("precioTotal");
    const precioMedio = document.getElementById("precioMedio");

    let contenidoResumen = "";
    let totalKilos = 0; 
    let totalGastado = dineroGastado; 

    
    frutas.forEach(function(nombreFruta) {
        const i = frutas.indexOf(nombreFruta)
        let kilos = cantidades[i];
        if (kilos > 0) {
            contenidoResumen = contenidoResumen + nombreFruta + " ---- " + kilos + " kg" + "<br>"; 
            totalKilos = totalKilos + kilos; 
        }
    });

    resumenCompra.innerHTML = contenidoResumen; 
    totalPrecio.textContent = "Precio total: " + totalGastado.toFixed(2) + " €";

    if (totalKilos > 0) {
        const precioMedioCalculado = totalGastado / totalKilos;
        precioMedio.textContent = "Precio medio: " + precioMedioCalculado.toFixed(2) + " €/kg";
    }
}

document.getElementById("terminarCompra").onclick = reiniciarCompra;

function reiniciarCompra() {
    for (let i = 0; i < cantidades.length; i++) {
        cantidades[i] = 0; 
    }
    dineroGastado = 0; 
    mostrarResumen(); 
}

function agregarFrutaDesdeBoton(fruta) {
    añadirFruta(fruta);
    mostrarResumen();
}

frutas.forEach(function(fruta) {
    document.getElementById(fruta).onclick = function() {
        agregarFrutaDesdeBoton(fruta);
    };
});  