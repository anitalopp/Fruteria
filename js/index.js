const cantidades = {
    pitahaya: 0,
    chirimoya: 0,
    longan: 0,
    carambola: 0,
    kiwano: 0,
    maracuya: 0,
    lichi: 0,
    physalis: 0,
    kumquat: 0,
    pawpaw: 0,
};

const precios = {
    pitahaya: 9.15,
    chirimoya: 8.60,
    longan: 7.42,
    carambola: 6.70,
    kiwano: 8.99,
    maracuya: 5.22,
    lichi: 7.66,
    physalis: 10.32,
    kumquat: 8.20,
    pawpaw: 10.66,
};

let dineroGastado = 0;

function añadirFruta(fruta) {
    if (cantidades[fruta] !== undefined) {
        cantidades[fruta] += 1; 
        dineroGastado += precios[fruta]; 
    }
}

function mostrarResumen() {
    const resumenDetalles = document.getElementById("detallesCompra");
    const totalPrecioElement = document.getElementById("precioTotal");
    const precioMedioElement = document.getElementById("precioMedio");

    resumenDetalles.textContent = "";
    totalPrecioElement.textContent = "";
    precioMedioElement.textContent = "";

    let totalKilos = 0; 
    let totalGastado = dineroGastado; 

    const frutasOrdenadas = Object.keys(cantidades).sort().reverse();    

    frutasOrdenadas.forEach(nombreFruta => {
        let kilos = cantidades[nombreFruta];
        if (kilos > 0) {
            resumenDetalles.innerHTML += nombreFruta + " ---- " + kilos + " kg" + "<br>";;
            totalKilos += kilos; 
        }
    });
    

    totalPrecioElement.textContent = "Precio total: " + (totalGastado.toFixed(2)) + " €";

    if (totalKilos > 0) {
        const precioMedio = totalGastado / totalKilos;
        precioMedioElement.textContent = "Precio medio: " + precioMedio.toFixed(2) + " €/kg";
    } 
}

function reiniciarCompra() {
    for (let fruta in cantidades) {
        cantidades[fruta] = 0; 
    }
    dineroGastado = 0; 
    mostrarResumen(); 
}

function agregarFrutaDesdeBoton(fruta) {
    console.log("Agregando fruta " + fruta);
    añadirFruta(fruta);
    mostrarResumen();
}

document.getElementById("terminarCompra").onclick = reiniciarCompra;

const frutas = Object.keys(cantidades);
frutas.forEach(fruta => {
    document.getElementById(fruta).onclick = () => agregarFrutaDesdeBoton(fruta);
    console.log("Botón de " + fruta + " dado");
});

