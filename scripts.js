//variables y constantes
const inventario = [];
let ganancias = 0;

//agrega el juego al inventario
function agregarjuego(nombre,precio,genero,cantidad)
{
const juego = {
nombre: nombre,
precio: precio,
genero: genero,
cantidad: cantidad,//cantidad del stock del juego    
};
inventario.push(juego);
console.log(`Se agrego ${nombre} al inventario.`)
}

//funcion para mostrar el inventario
function mostrarinventario()
{
console.log("inventario:")
inventario .forEach(juego =>{
    console.log(`${juego.nombre} - Precio: ${juego.precio} - Género: ${juego.genero} - Stock: ${juego.cantidad}`);
})
}

//funcion para vender
function venderjuego(nombre)
{
    const juego= inventario.find(juego=> juego.nombre === nombre);
    if (juego) {
        if(juego.cantidad >0) {
            juego.cantidad--;
            ganancias += juego.precio;
            console.log(`se vendio ${nombre} ganancias: ${ganancias}`);
        } else{
            alert(`no hay stock de ${nombre}`);
        }
    }else {
        alert(`no se encontro el juego: ${nombre}`);

    }
}

agregarjuego("mortal kombat", 15000,"peleas", 100);
agregarjuego("mario kart", 20000, "carreras", 25);
mostrarinventario();
venderjuego("mortal kombat");
mostrarinventario();