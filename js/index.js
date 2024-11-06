var listaFrutas = [];
const compra = [];
var compraFinalizada = false;
var compraTotal = 0;
var totalKilosPedido = 0;

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
            }
            compra.push(nuevaFruta);
        }
        totalKilosPedido += kilos;
        compraTotal += kilos * fruta.precioKilo;
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

function mostrarResumen(fecha) {
    const resumenCompra = document.getElementById("resumenCompra");
    let totalPrecio = "Precio total: " + compraTotal.toFixed(2) + " €";
    let precioMedioCalculado = compraTotal / (totalKilosPedido != 0 ? totalKilosPedido : 1);
    let precioMedio = "Precio medio: " + precioMedioCalculado.toFixed(2) + " €/kg";
    let contenidoResumen = "";

    compra.forEach(fruta => {
        contenidoResumen += `${fruta.nombre} ---- ${fruta.numKilos} kg --- ${fruta.numKilos * buscarPorId(fruta.id).precioKilo}€ <br> `;
    });
    
    resumenCompra.innerHTML = `Fecha de compra: ${fecha}`;
    resumenCompra.innerHTML += `<br>${contenidoResumen}`;
    resumenCompra.innerHTML +=  `<br>${totalPrecio}`;
    resumenCompra.innerHTML += `<br>${precioMedio}`;

    compraFinalizada = true;
}

function finalizarPedido() {
    compra.sort((a, b) => b.nombre.localeCompare(a.nombre));

    const fechaCompra = new Date();
    const fechaFormateada = fechaCompra.toLocaleDateString("es-ES");
    const horaFormateada = fechaCompra.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });

    enviarPedido(`${fechaFormateada} ${horaFormateada}`);
    mostrarResumen(`${fechaFormateada} ${horaFormateada}`);
    reiniciarCompraTimeout();
}

function enviarPedido(fecha)  {
    let pedido = {
        "fecha": fecha, 
        "productos": compra,
    }
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
}

function reiniciarCompra() {
    compra.length = 0;
    dineroGastado = 0;

    document.getElementById("resumenCompra").innerHTML = "";

    compraFinalizada = false;

    const frutasAnadidas = document.getElementById('frutasAnadidas');
    frutasAnadidas.innerHTML = '';


}

function reiniciarCompraTimeout() {
    let valorVentana = abrirVentanaEmergente();
    setTimeout(() => {
        reiniciarCompra();
        valorVentana.close();
    }, 10000); 
}

function abrirVentanaEmergente() {
    let ventana = window.open("", "Ventana Emergente Frutería", "width=600, height= 600, menubar=No, scrollbar=No");
    ventana.document.write(abrirMensaje());
    return ventana;
}

function abrirMensaje() {
    let mensaje = "";
    compra.forEach(m => {
        let fruta = buscarPorId(m.id);
        if (fruta.temporada == "verano") {
            mensaje += `${fruta.nombre}: de verano, de proximidad: ${fruta.proximidad ? "si " : "no "}, y están recogidas en ${fruta.region}`;
        } else {
            mensaje += `${fruta.nombre}: de invierno, recomendable refrigerar: ${fruta.refrigerar ? "si " : "no "}`;
        }
    })    
    return mensaje;
}