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
function asignarEventos() {
    document.getElementById('si-tarjeta').addEventListener('change', gestionarCodigoCliente);
    document.getElementById('no-tarjeta').addEventListener('change', gestionarCodigoCliente);
}

function gestionarCodigoCliente() {
    let siTarjeta = document.getElementById('si-tarjeta');
    let noTarjeta = document.getElementById('no-tarjeta');

    if (siTarjeta.checked) {
        mostrarCodigoCliente();
    }
    else if (noTarjeta.checked) {
        ocultarCodigoCliente();
    }
}

function mostrarCodigoCliente() {
    document.getElementById('codigoCliente').classList.add('mostrar');
    document.getElementById('codigoCliente').classList.remove('ocultar');
}

function ocultarCodigoCliente() {
    document.getElementById('codigoCliente').classList.add('ocultar');
    document.getElementById('codigoCliente').classList.remove('mostrar');
}

function comprobarEstadoInicial() {
    var siTarjeta = document.getElementById('si-tarjeta');
    var noTarjeta = document.getElementById('no-tarjeta');
    
    if (!siTarjeta.checked && !noTarjeta.checked) {
        ocultarCodigoCliente();
    }

    if (siTarjeta.checked) {
        mostrarCodigoCliente();
    }

    if (noTarjeta.checked) {
        ocultarCodigoCliente();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    asignarEventos();
    comprobarEstadoInicial();
});

/* CAMBIOS PARA EL PUNTO 4.4 */
function recuperarInputs() {
    var inputs = {
      nombre: document.getElementById('nombre').value,
      apellidos: document.getElementById('apellidos').value,
      direccion: document.getElementById('direccion').value,
      correo: document.getElementById('correo').value,
      metodoPago: null,
      tarjetaCliente: null,
      codigo: document.getElementById('codigo').value
    };

    var metodoPagoSeleccionado = document.querySelector('input[name="pago"]:checked');
    if (metodoPagoSeleccionado) {
      inputs.metodoPago = metodoPagoSeleccionado.value;
    }

    var tarjetaClienteSeleccionada = document.querySelector('input[name="tarjeta-cliente"]:checked');
    if (tarjetaClienteSeleccionada) {
      inputs.tarjetaCliente = tarjetaClienteSeleccionada.value;
    }

    return inputs;
}

function validarInputs(inputs) {
    var valido = true;

    var nombrePattern = /^[a-zA-Z]{4,15}$/;
    var correoPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var codigoPattern = /^[a-zA-Z]{3}\d{4}[\/\.#&]$/;

    if (!nombrePattern.test(inputs.nombre)) {
      console.log("El nombre no es válido. Debe tener entre 4 y 15 letras.");
      valido = false;
    }

    if (inputs.apellidos === "") {
      console.log("Los apellidos no pueden estar vacíos.");
      valido = false;
    }

    if (inputs.direccion === "") {
      console.log("La dirección no puede estar vacía.");
      valido = false;
    }

    if (!correoPattern.test(inputs.correo)) {
      console.log("El correo electrónico no es válido.");
      valido = false;
    }

    if (!inputs.metodoPago) {
      console.log("Debe seleccionar un método de pago.");
      valido = false;
    }

    if (!inputs.tarjetaCliente) {
      console.log("Debe indicar si tiene tarjeta de cliente.");
      valido = false;
    }

    if (inputs.tarjetaCliente === 'si' && !codigoPattern.test(inputs.codigo)) {
      console.log("El código de cliente no es válido.");
      valido = false;
    }

    return valido;
}

document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault(); 

    var inputs = recuperarInputs(); 
    var esValido = validarInputs(inputs); 

    if (esValido) {
      this.submit(); 
    } else {
      alert("Hay datos incorrectos en el formulario");
    }
  });