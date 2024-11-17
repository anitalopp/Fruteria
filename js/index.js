var listaFrutas = [];
const carritoCompra = [];
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
    })
    .catch();       
}

function agregarFruta(id) { 
    const inputCantidadFrutas = document.getElementById(`input-${id}`);
    const kilos = parseInt(inputCantidadFrutas.value);
    const fruta = buscarPorId(id);

    if (!isNaN(kilos) && kilos > 0) {
        let indiceFruta = encontrarFrutaAgregada(id);
        if (indiceFruta != -1) {
            carritoCompra[indiceFruta].numKilos += kilos;
            carritoCompra[indiceFruta].importeTotal += kilos * fruta.precioKilo;
        } else {
            let frutaSeleccionada = {
                "id": fruta.id,
                "nombre": fruta.nombre, 
                "numKilos": kilos,
                "importeTotal": kilos * fruta.precioKilo,
            }
            carritoCompra.push(frutaSeleccionada);
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
        return null; 
    }
    return fruta;
}

function encontrarFrutaAgregada(id) {
    return carritoCompra.findIndex(fruta=>fruta.id == id);
}


function actualizarBarraLateral(fruta, kilos) {
    let zonaLateral = document.getElementById("frutasAnadidas");
    let linea = document.createElement("p");
    linea.innerText = `- ${fruta}: ${kilos} kg`;
    zonaLateral.appendChild(linea);
    aplicarEstilos(zonaLateral, fruta);
    zonaLateral.scrollTop = zonaLateral.scrollHeight;

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

/* function mostrarResumen(fecha) {
    const resumenCompra = document.getElementById("resumenCompra");
    let totalPrecio = "Precio total: " + compraTotal.toFixed(2) + " €";
    let precioMedioCalculado = compraTotal / (totalKilosPedido != 0 ? totalKilosPedido : 1);
    let precioMedio = "Precio medio: " + precioMedioCalculado.toFixed(2) + " €/kg";
    let contenidoResumen = "";

    carritoCompra.forEach(fruta => {
        contenidoResumen += `${fruta.nombre} ---- ${fruta.numKilos} kg --- ${fruta.numKilos * buscarPorId(fruta.id).precioKilo}€ <br> `;
    });
    
    resumenCompra.innerHTML = `Fecha de compra: ${fecha}`;
    resumenCompra.innerHTML += `<br>${contenidoResumen}`;
    resumenCompra.innerHTML +=  `<br>${totalPrecio}`;
    resumenCompra.innerHTML += `<br>${precioMedio}`;

    compraFinalizada = true;
} */

function enviarPedido(fecha)  {
    let pedido = {
        "fecha": fecha, 
        "productos": carritoCompra,
    }
    fetch("http://localhost:3000/pedidos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .catch();    
}

function reiniciarCompra() {
    carritoCompra.length = 0;
    dineroGastado = 0;

    document.getElementById("resumenCompra").innerHTML = "";

    compraFinalizada = false;

    const frutasAnadidas = document.getElementById('frutasAnadidas');
    frutasAnadidas.innerHTML = '';
}

function reiniciarCompraTimeout() {
    let ventanaEmergente = abrirVentanaEmergente();

    setTimeout(() => {
        reiniciarCompra();
        ventanaEmergente.close();
    }, 10000); 
}

function abrirVentanaEmergente() {
    let ventana = window.open("", "Ventana Emergente Frutería", "width=600, height= 600, menubar=No, scrollbar=No");

    ventana.document.write(obtenerMensajeTemporada());
    
    return ventana;
}

function obtenerMensajeTemporada() {
    let mensaje = "";

    carritoCompra.forEach(m => {
        let fruta = buscarPorId(m.id);
        if (fruta.temporada == "verano") {
            mensaje += `${fruta.nombre}: de verano, de proximidad: ${fruta.proximidad ? "si " : "no "}, y están recogidas en ${fruta.region}<br>`;
        } else {
            mensaje += `${fruta.nombre}: de invierno, recomendable refrigerar: ${fruta.refrigerar ? "si <br>" : "no <br>"}`;
        }
    })    
    return mensaje;
}

function finalizarPedido() {
    carritoCompra.sort((a, b) => b.nombre.localeCompare(a.nombre));

    const fechaPedido = new Date();
    const fechaFormateada = fechaPedido.toLocaleDateString("es-ES");
    const horaFormateada = fechaPedido.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });

    enviarPedido(`${fechaFormateada} ${horaFormateada}`);
    mostrarResumen(`${fechaFormateada} ${horaFormateada}`);
    reiniciarCompraTimeout();
}

/* CAMBIOS PARA EL PUNTO 1.3.6 */
function gestionarCodigoCliente() {
    var siTarjeta = document.getElementById('si-tarjeta');
    var noTarjeta = document.getElementById('no-tarjeta');

    if (siTarjeta.checked) {
        mostrarCodigoCliente();
    } else if (noTarjeta.checked) {
        ocultarCodigoCliente();
    }
}

function mostrarCodigoCliente() {
    document.getElementById('codigoCliente').style.display = 'block';
}

function ocultarCodigoCliente() {
    document.getElementById('codigoCliente').style.display = 'none';
}

document.getElementById('si-tarjeta').addEventListener('change', gestionarCodigoCliente);
document.getElementById('no-tarjeta').addEventListener('change', gestionarCodigoCliente);

