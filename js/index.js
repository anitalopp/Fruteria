var listaFrutas;
const frutasKilos = [];
var compraFinalizada = false;
const frutasAñadidas = document.getElementById('frutasAñadidas');
var ultimaFrutaAgregada = null; 

function cargarFrutas() {
    console.log("Frutas cargadas correctamente")
    fetch("http://localhost:3000/frutas")
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error al almacenar el pedido');
        }
    })
        .then((data) => {
            listaFrutas = data;

            document.getElementById("terminarCompra").onclick = function() {
                if (compraFinalizada) {
                    mostrarPeculiaridades();
                    reiniciarCompraTimeout();
                } else {
                    mostrarResumen();
                }
            };

            listaFrutas.forEach(fruta => {
                document.getElementById(fruta.nombre.toLowerCase()).onclick = () => agregarFruta(fruta.id);
            });
        })
        .catch((error) => console.error("Error al cargar frutas:", error));
        const imagenesFruta = document.querySelectorAll('.fruta img');

        listaFrutas.forEach(fruta => {
            const imagenFruta = document.getElementById(fruta.nombre.toLowerCase());
            
            if (imagenFruta) {
                imagenFruta.addEventListener('click', function() {
                    agregarFruta(fruta.id);
                });
            }
        });
        
}


function agregarFruta(id) {
    const inputFruta = document.getElementById(`input-${id}`);
    const kilos = parseInt(inputFruta.value);
    const fruta = buscarPorId(id);

    if (!isNaN(kilos) && kilos > 0) {
        let indiceFruta = encontrarFrutaAgregada(idF);
        if (indiceFruta != -1) {
            frutasKilos[indiceFruta].numKilos += kilos;
            frutasKilos[indiceFruta].importeTotal += kilos * fruta.precioKilo;
        } else {
            frutasKilos.push(
                {
                    "id": fruta.id,
                    "nombre": fruta.nombre, 
                    "numKilos": kilos,
                    "importeTotal": kilos * fruta.precioKilo,
                    "temporada": fruta.temporada,
                    "mensaje": fruta.mensaje
                }
            );
            actualizarBarraLateral(fruta.nombre, kilos);
        }
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
    return frutasKilos.findIndex(fruta=>fruta.id == id);
}


function mostrarResumen() {
    const resumenCompra = document.getElementById("resumenCompra");
    const totalPrecio = document.getElementById("precioTotal");
    const precioMedio = document.getElementById("precioMedio");

    let contenidoResumen = "";
    let totalKilos = 0;
    let dineroGastado = 0;

    frutasKilos.forEach(fruta => {
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
    frutasKilos.length = 0;
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
    if (kilos > 0) {
        const frutaExistente = frutasAñadidas.querySelector(`.fruta-item[data-fruta="${fruta}"]`);
        
        if (frutaExistente) {
            const cantidadActual = parseInt(frutaExistente.textContent.split(': ')[1]);
            frutaExistente.textContent = `${fruta}: ${cantidadActual + kilos} kg`;
        } else {
            const nuevaFruta = document.createElement('div');
            nuevaFruta.classList.add('fruta-item'); 
            nuevaFruta.textContent = `${fruta}: ${kilos} kg`; 
            nuevaFruta.setAttribute('data-fruta', fruta);
            frutasAñadidas.appendChild(nuevaFruta);
        }

        if (ultimaFrutaAgregada) {
            ultimaFrutaAgregada.classList.remove('subrayado');
        }
        
        const frutasPrevias = frutasAñadidas.querySelectorAll(`.fruta-item[data-fruta="${fruta}"]`);
        frutasPrevias.forEach(frutaItem => {
            frutaItem.classList.add('subrayado'); 
        });
        

        ultimaFrutaAgregada = frutasAñadidas.lastElementChild; 
    }
}
    
function finalizarPedido() {
    frutasKilos.sort((a, b) => b.nombre.localeCompare(a.nombre));

    let totalKilos = 0;
    let precioTotal = 0;
    frutasKilos.forEach(fruta => {
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
        frutas: frutasKilos.map(fruta => ({
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

    frutasKilos.forEach(fruta => {
        resumenCompra.innerHTML += `${fruta.nombre} ---- ${fruta.numKilos} kilos --- ${fruta.precioKilo.toFixed(2)}€ --- ${fruta.importeTotal.toFixed(2)}€<br>`;
    });

    resumenCompra.innerHTML += `<br>Precio total: ${precioTotal} €<br>`;
    resumenCompra.innerHTML += `Precio medio: ${precioMedio} €/kg`;

    compraFinalizada = true;
}

function mostrarPeculiaridades() {
    const ventanaEmergente = document.getElementById("ventanaEmergente");  
    const contenidoVentana = document.getElementById("contenidoVentanaEmergentes");

    const frutasResumen = frutasKilos.map(fruta => {
        return `${fruta.nombre}: ${fruta.mensaje}`;
    }).join("<br>");

    contenidoVentana.innerHTML = frutasResumen; 
    ventanaEmergente.style.display = "block"; 

    document.getElementById("cerrarModal").onclick = function() {
        ventanaEmergente.style.display = "none";
    };
}

