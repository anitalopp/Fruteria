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

let frutasKilos = {};
frutas.forEach(fruta => {
    frutasKilos[fruta] = 0; 
});

let dineroGastado = 0;
let compraFinalizada = false;

function agregarFrutaDesdeBoton(fruta) {
    const inputFruta = document.getElementById(`input-${fruta}`);
    const kilos = parseFloat(inputFruta.value);    
    
    if (!isNaN(kilos) && kilos > 0) {
        frutasKilos[fruta] += kilos; 
        dineroGastado += kilos * precios[frutas.indexOf(fruta)]; 
        inputFruta.value = ''; 
    } else {        
        alert("Por favor, ingrese un número de kilos válido");
    }
}

function mostrarResumen() {
    const resumenCompra = document.getElementById("resumenCompra");
    const totalPrecio = document.getElementById("precioTotal");
    const precioMedio = document.getElementById("precioMedio");

    let contenidoResumen = "";
    let totalKilos = 0;

    for (const fruta in frutasKilos) {
        const kilos = frutasKilos[fruta];
        if (kilos > 0) {
            contenidoResumen += `${fruta} ---- ${kilos} kg<br>`;
            totalKilos += kilos;
        }
    }

    resumenCompra.innerHTML = contenidoResumen;
    totalPrecio.textContent = "Precio total: " + dineroGastado.toFixed(2) + " €";

    if (totalKilos > 0) {
        const precioMedioCalculado = dineroGastado / totalKilos;
        precioMedio.textContent = "Precio medio: " + precioMedioCalculado.toFixed(2) + " €/kg";
    } else {
        precioMedio.textContent = "No se han agregado frutas.";
    }

    compraFinalizada = true;
}

function reiniciarCompra() {
    frutas.forEach(fruta => {
        frutasKilos[fruta] = 0; 
    });
    dineroGastado = 0;

    document.getElementById("resumenCompra").innerHTML = "";
    document.getElementById("precioTotal").textContent = "";
    document.getElementById("precioMedio").textContent = "";
    compraFinalizada = false;
}

document.getElementById("terminarCompra").onclick = function() {
    if (compraFinalizada) {
        reiniciarCompra();
    } else {
        mostrarResumen();
    }
};

frutas.forEach(fruta => {
    document.getElementById(fruta).onclick = function() {
        agregarFrutaDesdeBoton(fruta);
    };
});
