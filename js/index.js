var listaFrutas;
function cargarFrutas() {
    fetch("http://localhost:3000/frutas")
        .then((response) => response.json())
        .then((data) => listaFrutas=data)
        .catch((error) => console.error("Error al cargar frutas:", error));
}

cargarFrutas();

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

function agregarFrutaDesdeBoton(fruta) {
    const inputFruta = document.getElementById(`input-${fruta}`);
    const kilos = parseFloat(inputFruta.value);    

    if (!isNaN(kilos) && kilos > 0) {
        frutasKilos[fruta] += kilos; 
        dineroGastado += kilos * precios[frutas.indexOf(fruta)]; 
        inputFruta.value = ''; 
        agregarFrutaAlLateral(fruta, kilos);  
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

function mostrarPeculiaridades() {
    const mensaje = [];

    for (const fruta in frutasKilos) {
        const kilos = frutasKilos[fruta];
        if (kilos > 0 && peculiaridadesFrutas[fruta]) {
            mensaje.push(`${fruta.charAt(0).toUpperCase() + fruta.slice(1)} ${peculiaridadesFrutas[fruta]}`);
        }
    }

    if (mensaje.length > 0) {
        alert(mensaje.join('\n')); 
    } else {
        alert("No hay frutas seleccionadas.");
    }
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

document.getElementById("terminarCompra").onclick = function() {
    if (compraFinalizada) {
        mostrarPeculiaridades(); 
        reiniciarCompraTimeout();
    } else {
        mostrarResumen();
    }
};

frutas.forEach(fruta => {
    document.getElementById(fruta).onclick = function() {
        agregarFrutaDesdeBoton(fruta);
    };
});

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

