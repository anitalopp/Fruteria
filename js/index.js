var listaFrutas = [];
const compra = [];
var compraFinalizada = false;
const frutasAñadidas = document.getElementById('frutasAñadidas');
var compraTotal = 0;

function cargarFrutas() {
    
    fetch("http://localhost:3000/frutas")
    .then(response => {
        return response.json();
    })
    .then((data) => {
        listaFrutas = data;
        console.log("Frutas cargadas correctamente");
    })
    .catch((error) => console.error("Error al cargar frutas:", error));       
}

function agregarFruta(id) { 
    const inputFruta = document.getElementById(`input-${id}`);
    const kilos = parseInt(inputFruta.value);
    const fruta = buscarPorId(id);

    if (!isNaN(kilos) && kilos > 0) {
        let indiceFruta = encontrarFrutaAgregada(id);
        if (indiceFruta != -1) {
            compra[indiceFruta].numKilos += kilos;
            compra[indiceFruta].importeTotal += kilos * fruta.precioKilo;
        } else {
            let nuevaFruta = {
                "id": fruta.id,
                "nombre": fruta.nombre, 
                "numKilos": kilos,
                "importeTotal": kilos * fruta.precioKilo,
                "temporada": fruta.temporada,
                "mensaje": fruta.mensaje
            }
            compra.push(nuevaFruta);
        }
        actualizarBarraLateral(fruta.nombre, kilos);
    } else {        
        alert("Por favor, ingrese un número de kilos válido");
    }
}

function buscarPorId(id) {
    const fruta = listaFrutas.find(fruta => fruta.id == id);
    if (!fruta) {
        console.error("Fruta no encontrada:", id);
        return null; 
    }
    return fruta;
}

function encontrarFrutaAgregada(id) {
    return compra.findIndex(fruta=>fruta.id == id);
}


function mostrarResumen() {
    const resumenCompra = document.getElementById("resumenCompra");
    const totalPrecio = document.getElementById("precioTotal");
    const precioMedio = document.getElementById("precioMedio");

    let contenidoResumen = "";
    let totalKilos = 0;
    let dineroGastado = 0;

    compra.forEach(fruta => {
        contenidoResumen += `${fruta.nombre} ---- ${fruta.numKilos} kg<br>`;
        totalKilos += fruta.numKilos; 
        dineroGastado += fruta.importeTotal; 
    });
    

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
    compra.length = 0;
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


function actualizarBarraLateral(fruta, kilos) {
    let zonaLateral = document.getElementById("frutasAnadidas");
    let linea = document.createElement("p");
    linea.innerText = `${fruta} ${kilos} kilo${kilos>1?"s":""}`;
    zonaLateral.appendChild(linea);
    aplicarEstilos(zonaLateral, fruta);
    }
    
function aplicarEstilos(zonaLateral, fruta) {
    let frutasAnadidas = Array.from(zonaLateral.children);
    frutasAnadidas.forEach (f => {
        if (f.textContent.includes(fruta)) {
            f.classList.add("resaltada");
        } else {
            f.classList.remove("resaltada");
        }
    })
}
function finalizarPedido() {
    compra.sort((a, b) => b.nombre.localeCompare(a.nombre));

    let totalKilos = 0;
    let precioTotal = 0;
    compra.forEach(fruta => {
        totalKilos += fruta.numKilos;
        precioTotal += fruta.importeTotal;
    });
    const precioMedio = totalKilos > 0 ? (precioTotal / totalKilos).toFixed(3) : 0;
    precioTotal = precioTotal.toFixed(2); 

    const fechaCompra = new Date();
    const fechaFormateada = fechaCompra.toLocaleDateString("es-ES");
    const horaFormateada = fechaCompra.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });

    const pedido = {
        fecha: `${fechaFormateada} ${horaFormateada}`,
        frutas: compra.map(fruta => ({
            id: fruta.id,
            kilos: fruta.numKilos,
            precioPorKilo: fruta.precioKilo,
            importeTotal: fruta.importeTotal
        })),
        total: parseFloat(precioTotal),
        precioMedio: parseFloat(precioMedio)
    };
    
    fetch("http://localhost:3000/pedidos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Pedido almacenado con éxito:", data);
    })
    .catch(error => console.error("Error al almacenar el pedido:", error));

    const resumenCompra = document.getElementById("resumenCompra");
    resumenCompra.innerHTML = `Fecha de compra: ${fechaFormateada} ${horaFormateada}<br><br>`;

    compra.forEach(fruta => {
        resumenCompra.innerHTML += `${fruta.nombre} ---- ${fruta.numKilos} kilos --- ${fruta.precioKilo.toFixed(2)}€ --- ${fruta.importeTotal.toFixed(2)}€<br>`;
    });

    resumenCompra.innerHTML += `<br>Precio total: ${precioTotal} €<br>`;
    resumenCompra.innerHTML += `Precio medio: ${precioMedio} €/kg`;

    compraFinalizada = true;
}

/* function mostrarPeculiaridades() {
    const ventanaEmergente = document.getElementById("ventanaEmergente");  
    const contenidoVentana = document.getElementById("contenidoVentanaEmergentes");
}

 */