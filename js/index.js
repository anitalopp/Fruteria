
const botonTerminar = document.getElementById('terminarCompra');

botonTerminar.addEventListener('click', procesarCompra);

function procesarCompra() {
    const resumenCompra = document.getElementById('resumenCompra');
    const precioTotal = document.getElementById('precioTotal');
    const precioMedio = document.getElementById('precioMedio');
    
    resumenCompra.innerHTML = '';
    precioTotal.innerHTML = '';
    precioMedio.innerHTML = '';

    let total = 0;
    let cantidadFrutas = 0;

    frutas.forEach(fruta => {
        const inputFruta = document.getElementById(`input-${fruta.id}`);
        const kilos = parseFloat(inputFruta.value);

        if (kilos > 0) {
            const precioFruta = (kilos * fruta.precio).toFixed(2);
            total += parseFloat(precioFruta);
            cantidadFrutas += kilos;

            agregarResumenFruta(fruta, kilos, precioFruta, resumenCompra);
        }
    });

    precioTotal.textContent = `Precio Total: ${total.toFixed(2)} EUR`;
    if (cantidadFrutas > 0) {
        precioMedio.textContent = `Precio Medio: ${(total / cantidadFrutas).toFixed(2)} EUR/kg`;
    } else {
        precioMedio.textContent = 'No se han seleccionado frutas.';
    }
}

function agregarResumenFruta(fruta, kilos, precioFruta, contenedor) {
    const frutaResumen = document.createElement('div');
    frutaResumen.textContent = `${fruta.nombre}: ${kilos} kg x ${fruta.precio} EUR/kg = ${precioFruta} EUR`;
    contenedor.appendChild(frutaResumen);
}
















/* 
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



function inicializarCompra() {
    frutas.forEach(function(fruta) {
        document.getElementById(fruta).onclick = function() {
            agregarFrutaDesdeBoton(fruta);
        };
    });

    document.getElementById("terminarCompra").onclick = mostrarResumen;
}

inicializarCompra();
 */