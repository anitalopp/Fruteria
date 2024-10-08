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

var dineroGastado = 0;

var precios = {
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


document.getElementById("pitahaya").onclick = function() {
    añadirFruta("pitahaya");
    mostrarResumenCompra();
};

document.getElementById("chirimoya").onclick = function() {
    añadirFruta("chirimoya");
    mostrarResumenCompra();
};

document.getElementById("longan").onclick = function() {
    añadirFruta("longan");
    mostrarResumenCompra();
};

document.getElementById("carambola").onclick = function() {
    añadirFruta("carambola");
    mostrarResumenCompra();
};

document.getElementById("kiwano").onclick = function() {
    añadirFruta("kiwano");
    mostrarResumenCompra();
};

document.getElementById("maracuya").onclick = function() {
    añadirFruta("maracuya");
    mostrarResumenCompra();
};

document.getElementById("lichi").onclick = function() {
    añadirFruta("lichi");
    mostrarResumenCompra();
};

document.getElementById("physalis").onclick = function() {
    añadirFruta("physalis");
    mostrarResumenCompra();
};

document.getElementById("kumquat").onclick = function() {
    añadirFruta("kumquat");
    mostrarResumenCompra();
};

document.getElementById("pawpaw").onclick = function() {
    añadirFruta("pawpaw");
    mostrarResumenCompra();
};

document.getElementById("terminarCompra").onclick = function() {
    mostrarResumenCompra(); 
    reiniciarCompra(); 
};
