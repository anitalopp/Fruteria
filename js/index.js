// Función para cargar la lista de frutas desde el servidor
function cargarFrutas() {
    fetch("http://localhost:3000/fruteria") // Realiza una petición a la API de frutas
        .then((response) => response.json()) // Convierte la respuesta en JSON
        .then((data) => cargarDatosSelect(data)) // Llama a la función para llenar el select con los datos recibidos
        .catch((error) => console.error("Error al cargar frutas:", error)); // Maneja errores en la carga
}

// Función para cargar las frutas en el elemento <select> del HTML
function cargarDatosSelect(datosFrutas) {
    let selectFrutas = document.getElementById("frutas"); // Obtiene el elemento select por su ID

    datosFrutas.forEach((fruta) => {
        let elementOption = document.createElement("option"); // Crea un nuevo elemento option
        elementOption.setAttribute("value", fruta.nombre); // Establece el valor de la opción
        elementOption.innerText = fruta.nombre; // Establece el texto que se mostrará en la opción
        selectFrutas.appendChild(elementOption); // Añade la opción al select
    });
}
cargarFrutas(); // Llama a la función para cargar las frutas al cargar la página

// Arreglos de frutas y precios
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

// Objeto para llevar el registro de las frutas y la cantidad en kilos
let frutasKilos = {};
frutas.forEach(fruta => {
    frutasKilos[fruta] = 0; // Inicializa cada fruta con 0 kilos
});

let dineroGastado = 0; // Inicializa el total gastado
let compraFinalizada = false; // Inicializa el estado de la compra

// Objeto que contiene peculiaridades sobre cada fruta
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

// Función para agregar fruta desde un botón
function agregarFrutaDesdeBoton(fruta) {
    const inputFruta = document.getElementById(`input-${fruta}`); // Obtiene el input correspondiente a la fruta
    const kilos = parseFloat(inputFruta.value); // Convierte el valor del input a un número

    // Verifica que el valor ingresado sea válido
    if (!isNaN(kilos) && kilos > 0) {
        frutasKilos[fruta] += kilos; // Suma los kilos de la fruta al objeto
        dineroGastado += kilos * precios[frutas.indexOf(fruta)]; // Calcula el dinero gastado por la fruta
        inputFruta.value = ''; // Limpia el input
        agregarFrutaAlLateral(fruta, kilos); // Actualiza la visualización lateral con la fruta agregada
    } else {        
        alert("Por favor, ingrese un número de kilos válido"); // Mensaje de error si el input es inválido
    }
}

// Función para mostrar el resumen de la compra
function mostrarResumen() {
    const resumenCompra = document.getElementById("resumenCompra");
    const totalPrecio = document.getElementById("precioTotal");
    const precioMedio = document.getElementById("precioMedio");

    let contenidoResumen = "";
    let totalKilos = 0;

    // Construye el resumen de la compra
    for (const fruta in frutasKilos) {
        const kilos = frutasKilos[fruta];
        if (kilos > 0) {
            contenidoResumen += `${fruta} ---- ${kilos} kg<br>`; // Añade la fruta y sus kilos al resumen
            totalKilos += kilos; // Suma los kilos totales
        }
    }

    resumenCompra.innerHTML = contenidoResumen; // Actualiza el HTML del resumen
    totalPrecio.textContent = "Precio total: " + dineroGastado.toFixed(2) + " €"; // Muestra el total gastado

    // Calcula y muestra el precio medio
    if (totalKilos > 0) {
        const precioMedioCalculado = dineroGastado / totalKilos;
        precioMedio.textContent = "Precio medio: " + precioMedioCalculado.toFixed(2) + " €/kg";
    } else {
        precioMedio.textContent = "No se han agregado frutas."; // Mensaje si no se han agregado frutas
    }

    compraFinalizada = true; // Marca la compra como finalizada
}

// Función para mostrar las peculiaridades de las frutas seleccionadas
function mostrarPeculiaridades() {
    const mensaje = [];

    for (const fruta in frutasKilos) {
        const kilos = frutasKilos[fruta];
        if (kilos > 0 && peculiaridadesFrutas[fruta]) {
            mensaje.push(`${fruta.charAt(0).toUpperCase() + fruta.slice(1)} ${peculiaridadesFrutas[fruta]}`); // Formatea el mensaje
        }
    }

    // Muestra un mensaje con las peculiaridades o un mensaje si no hay frutas seleccionadas
    if (mensaje.length > 0) {
        alert(mensaje.join('\n')); 
    } else {
        alert("No hay frutas seleccionadas.");
    }
}

// Función para reiniciar la compra
function reiniciarCompra() {
    frutas.forEach(fruta => {
        frutasKilos[fruta] = 0; // Reinicia los kilos de cada fruta
    });
    dineroGastado = 0; // Reinicia el dinero gastado

    // Limpia los elementos del resumen y de los precios
    document.getElementById("resumenCompra").innerHTML = "";
    document.getElementById("precioTotal").textContent = "";
    document.getElementById("precioMedio").textContent = "";
    compraFinalizada = false; // Marca la compra como no finalizada

    const frutasAñadidas = document.getElementById('frutasAñadidas');
    frutasAñadidas.innerHTML = ''; // Limpia la lista lateral de frutas añadidas
}

// Función para reiniciar la compra automáticamente después de un tiempo
function reiniciarCompraTimeout() {
    setTimeout(() => {
        reiniciarCompra(); // Llama a la función de reiniciar la compra
    }, 10000); // Tiempo de espera de 10 segundos
}

// Evento al hacer clic en el botón de terminar compra
document.getElementById("terminarCompra").onclick = function() {
    if (compraFinalizada) {
        mostrarPeculiaridades(); // Muestra las peculiaridades si la compra ha sido finalizada
        reiniciarCompraTimeout(); // Reinicia la compra después del tiempo definido
    } else {
        mostrarResumen(); // Si no se ha finalizado la compra, muestra el resumen
    }
};

// Asocia un evento de clic a cada fruta para agregarla al carrito
frutas.forEach(fruta => {
    document.getElementById(fruta).onclick = function() {
        agregarFrutaDesdeBoton(fruta); // Llama a la función para agregar la fruta al hacer clic
    };
});

// Elemento para mostrar las frutas añadidas
const frutasAñadidas = document.getElementById('frutasAñadidas');
let ultimaFrutaAgregada = null; // Variable para seguir la última fruta añadida

// Función para agregar la fruta a la sección lateral de visualización
function agregarFrutaAlLateral(fruta, kilos) {
    if (kilos > 0) {
        const frutaActual = document.createElement('div'); // Crea un nuevo div para la fruta
        frutaActual.classList.add('fruta-item'); // Añade una clase para estilos
        frutaActual.textContent = `${fruta}: ${kilos} kg`; // Establece el texto del div

        if (ultimaFrutaAgregada) {
            ultimaFrutaAgregada.classList.remove('subrayado'); // Quita el subrayado de la última fruta agregada
        }

        // Marca las frutas previamente agregadas
        const frutasPrevias = frutasAñadidas.querySelectorAll(`.fruta-item[data-fruta="${fruta}"]`);
        frutasPrevias.forEach(frutaPrevias => {
            frutaPrevias.classList.add('subrayado'); // Añade un subrayado a frutas repetidas
        });

        frutaActual.setAttribute('data-fruta', fruta); // Establece un atributo data para identificación

        frutasAñadidas.appendChild(frutaActual); // Añade el nuevo elemento a la lista de frutas añadidas

        ultimaFrutaAgregada = frutaActual; // Actualiza la última fruta agregada
    }
}
