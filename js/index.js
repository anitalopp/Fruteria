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
        asignarTooltips(); 
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

/*     document.getElementById("resumenCompra").innerHTML = "";*/
    compraFinalizada = false;

    const frutasAnadidas = document.getElementById('frutasAnadidas');
    frutasAnadidas.innerHTML = '';
}

/* function reiniciarCompraTimeout() {
    let ventanaEmergente = abrirVentanaEmergente();

    setTimeout(() => {
        reiniciarCompra();
        ventanaEmergente.close();
    }, 10000); 
} */

/* function obtenerMensajeTemporada() {
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
} */

function finalizarPedido() {
    carritoCompra.sort((a, b) => b.nombre.localeCompare(a.nombre));

    const fechaPedido = new Date();
    const fechaFormateada = fechaPedido.toLocaleDateString("es-ES");
    const horaFormateada = fechaPedido.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });

    enviarPedido(`${fechaFormateada} ${horaFormateada}`);
    mostrarResumen(`${fechaFormateada} ${horaFormateada}`);
/*     reiniciarCompraTimeout();*/
}

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

    var labels = document.querySelectorAll('label');
    labels.forEach(function(label) {
        label.classList.remove('error-label');
    });

    var nombrePattern = /^[a-zA-Z]{4,15}$/;
    var correoPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var codigoPattern = /^[a-zA-Z]{3}\d{4}[\/\.#&]$/;

    if (!nombrePattern.test(inputs.nombre)) {
        console.log("El nombre no es válido. Debe tener entre 4 y 15 letras.");
        var labelNombre = document.querySelector('label[for="nombre"]');
        if (labelNombre) labelNombre.classList.add('error-label');
        valido = false;
    }

    if (inputs.apellidos === "") {
        console.log("Los apellidos no pueden estar vacíos.");
        var labelApellidos = document.querySelector('label[for="apellidos"]');
        if (labelApellidos) labelApellidos.classList.add('error-label');
        valido = false;
    }

    if (inputs.direccion === "") {
        console.log("La dirección no puede estar vacía.");
        var labelDireccion = document.querySelector('label[for="direccion"]');
        if (labelDireccion) labelDireccion.classList.add('error-label');
        valido = false;
    }

    if (!correoPattern.test(inputs.correo)) {
        console.log("El correo electrónico no es válido.");
        var labelCorreo = document.querySelector('label[for="correo"]');
        if (labelCorreo) labelCorreo.classList.add('error-label');
        valido = false;
    }

    if (!inputs.metodoPago) {
        console.log("Debe seleccionar un método de pago.");
        var labelMetodoPago = document.querySelector('label[for="pago"]');
        if (labelMetodoPago) labelMetodoPago.classList.add('error-label');
        valido = false;
    }

    if (!inputs.tarjetaCliente) {
        console.log("Debe indicar si tiene tarjeta de cliente.");
        var labelTarjetaCliente = document.querySelector('label[for="si-tarjeta"]');
        if (labelTarjetaCliente) labelTarjetaCliente.classList.add('error-label');
        valido = false;
    }

    if (inputs.tarjetaCliente === 'si' && document.getElementById('codigoCliente').classList.contains('mostrar') && !codigoPattern.test(inputs.codigo)) {
        console.log("El código de cliente no es válido.");
        var labelCodigo = document.querySelector('label[for="codigo"]');
        if (labelCodigo) labelCodigo.classList.add('error-label');
        valido = false;
    }

    return valido;
}

document.addEventListener('DOMContentLoaded', function() {
    asignarEventos();
    comprobarEstadoInicial();

    document.getElementById('formulario').addEventListener('submit', function(event) {
        event.preventDefault();

        var inputs = recuperarInputs();
        var esValido = validarInputs(inputs);

        if (esValido) {
            abrirVentanaEmergente();
        } else {
            alert("Hay datos incorrectos en el formulario");
        }
    });
});

function abrirVentanaEmergente() {
    let ventana = window.open("", "Ventana Emergente Frutería", "width=500, height=300, toolbar=No, location=No");

    crearContenidoVentanaEmergente(ventana);
}

function crearContenidoVentanaEmergente(ventana) {
    ventana.document.body.innerHTML = "";

    const botonTerminar = ventana.document.createElement('button');
    botonTerminar.textContent = 'Terminar Pedido';
    botonTerminar.classList.add('boton-estilo');
    botonTerminar.addEventListener('click', function() {
        terminarPedido(ventana);
    });

    const botonVolver = ventana.document.createElement('button');
    botonVolver.textContent = 'Volver';
    botonVolver.addEventListener('click', function() {
        volverAlPedido(ventana);
    });

    ventana.document.body.appendChild(botonTerminar);
    ventana.document.body.appendChild(botonVolver);
}


function terminarPedido(ventana) {
    reiniciarCompra();
    ventana.close();
}

function volverAlPedido(ventana) {
    ventana.close();
}


function asignarTooltips() {
    const frutasImgs = document.querySelectorAll('.fruta img');  

    frutasImgs.forEach(img => {
        img.addEventListener('mouseover', function(event) {
            const frutaId = event.target.getAttribute('data-id'); 
            const fruta = buscarPorId(frutaId);  

            if (fruta) {
                const mensaje = obtenerMensajeTemporada(fruta); 
                mostrarTooltip(event, mensaje);
            }
        });

        img.addEventListener('mouseout', ocultarTooltip); 
    });
}

function obtenerMensajeTemporada(fruta) {
    if (fruta.temporada === 'verano') {
        return `${fruta.nombre}: de verano, de proximidad: ${fruta.proximidad ? "sí" : "no"}, y están recogidas en ${fruta.region}`;
    } else {
        return `${fruta.nombre}: de invierno, recomendable refrigerar: ${fruta.refrigerar ? "sí" : "no"}`;
    }
}

function mostrarTooltip(event, mensaje) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.innerText = mensaje;
    document.body.appendChild(tooltip);

    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
}

function ocultarTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}