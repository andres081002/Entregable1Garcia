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
console.log("Se agrego ${nombre} al inventario.")
}