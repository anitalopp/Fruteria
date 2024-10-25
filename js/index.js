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

let cantidades = Array(frutas.length).fill(0);
let dineroGastado = 0;
let compraFinalizada = false;

function añadirFruta(fruta) {
    if (compraFinalizada) {
        reiniciarCompra();
    }
    const i = frutas.indexOf(fruta);
    if (i !== -1) {
        cantidades[i] += 1;
        dineroGastado += precios[i];
    }
}

function mostrarResumen() {
    const frutasOrdenadas = frutas.concat().sort().reverse();

    const resumenCompra = document.getElementById("resumenCompra");
    const totalPrecio = document.getElementById("precioTotal");
    const precioMedio = document.getElementById("precioMedio");

    let contenidoResumen = "";
    let totalKilos = 0;
    let totalGastado = dineroGastado;

    frutasOrdenadas.forEach(function(nombreFruta) {
        const i = frutas.indexOf(nombreFruta);
        const kilos = cantidades[i];
        if (kilos > 0) {
            contenidoResumen += nombreFruta + " ---- " + kilos + " kg<br>";
            totalKilos += kilos;
        }
    });

    resumenCompra.innerHTML = contenidoResumen;
    totalPrecio.textContent = "Precio total: " + totalGastado.toFixed(2) + " €";

    if (totalKilos > 0) {
        const precioMedioCalculado = totalGastado / totalKilos;
        precioMedio.textContent = "Precio medio: " + precioMedioCalculado.toFixed(2) + " €/kg";
    }

    compraFinalizada = true;
}

function reiniciarCompra() {
    cantidades.fill(0);
    dineroGastado = 0;

    document.getElementById("resumenCompra").innerHTML = "";
    document.getElementById("precioTotal").textContent = "";
    document.getElementById("precioMedio").textContent = "";

    compraFinalizada = false;
}

function agregarFrutaDesdeBoton(fruta) {
    añadirFruta(fruta);
}

function inicializarCompra() {
    frutas.forEach(function(fruta) {
        document.getElementById(fruta).onclick = function() {
            agregarFrutaDesdeBoton(fruta);
        };
    });

    document.getElementById("terminarCompra").onclick = mostrarResumen;
}

inicializarCompra();
