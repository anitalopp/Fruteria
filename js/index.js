var listaFrutas;
var frutasKilos = [];
var dineroGastado = 0;
var compraFinalizada = false;

function cargarFrutas() {
    fetch("http://localhost:3000/frutas")
        .then((response) => response.json())
        .then((data) => {
            listaFrutas=data;
            document.getElementById("terminarCompra").onclick = function() {
                if (compraFinalizada) {
                    mostrarPeculiaridades(); 
                    reiniciarCompraTimeout();
                } else {
                    mostrarResumen();
                }
            };
            
            listaFrutas.forEach(fruta => {
                document.getElementById(fruta.nombre.toLowerCase()).onclick = agregarFrutaDesdeBoton(fruta.id);

            });
        })
        .catch((error) => console.error("Error al cargar frutas:", error));
}

function agregarFrutaDesdeBoton(idF) {
    const inputFruta = document.getElementById(`input-${fruta.toLowerCase()}`);
    const kilos = parseInt(inputFruta.value);
    const fruta = buscarPorId(idF);

    if (!isNaN(kilos) && kilos > 0) {
        let indiceFruta = encontrarFrutaAgregada(idF);
        if (indiceFruta != -1) {
            frutasKilos[indiceFruta].numKilos += kilos;
            frutasKilos[indiceFruta].importeTotal += kilos * fruta.precioKilo;
        } else {
            frutasKilos.push(
                {
// TODO
                }
            )
        }
    } else {        
        alert("Por favor, ingrese un número de kilos válido");
    }
}

function buscarPorId(id) {
    listaFrutas.find(fruta=>fruta.id==id);
}

function encontrarFrutaAgregada(id) {
    return frutasKilos.findIndex(fruta=>fruta.id==id);
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

    const frutasAñadidas = document.getElementById('frutasAñadidas');
    frutasAñadidas.innerHTML = '';
}

function reiniciarCompraTimeout() {
    setTimeout(() => {
        reiniciarCompra();
    }, 10000); 
}

const frutasAñadidas = document.getElementById('frutasAñadidas');
let ultimaFrutaAgregada = null; 

function agregarFrutaAlLateral(fruta, kilos) {
    if (kilos > 0) {
        const frutaActual = document.createElement('div');
        frutaActual.classList.add('fruta-item'); 
        frutaActual.textContent = `${fruta}: ${kilos} kg`; 

        if (ultimaFrutaAgregada) {
            ultimaFrutaAgregada.classList.remove('subrayado');
        }

        const frutasPrevias = frutasAñadidas.querySelectorAll(`.fruta-item[data-fruta="${fruta}"]`);
        frutasPrevias.forEach(frutaPrevias => {
            frutaPrevias.classList.add('subrayado'); 
        });

        frutaActual.setAttribute('data-fruta', fruta);

        frutasAñadidas.appendChild(frutaActual);

        ultimaFrutaAgregada = frutaActual; 
    }
}


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


const peculiaridadesFrutas = {
    "pitahaya": "es fruta de verano y rica en vitamina C.",
    "chirimoya": "es fruta de invierno, dulce y cremosa.",
    "longan": "es fruta de verano, refrescante y tropical.",
    "carambola": "es fruta de verano, ácida y jugosa.",
    "kiwano": "es fruta de verano, exótica y rica en antioxidantes.",
    "maracuya": "es fruta de verano, muy aromática y rica en fibra.",
    "lichi": "es fruta de verano, dulce y refrescante.",
    "physalis": "es fruta de verano, tiene un sabor agridulce.",
    "kumquat": "es fruta de invierno, se puede comer con piel.",
    "pawpaw": "es fruta de verano, rica en vitaminas A y C."
};

