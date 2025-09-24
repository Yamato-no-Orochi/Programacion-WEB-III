//Antes
function conPromesas() {
    return obtenerDatos()
        .then(datos => procesar(datos))
        .then(resultado => console.log(resultado));
}
//Despues
async function conAsyncAwait() {
    const datos = await obtenerDatos();
    const resultado = await procesar(datos);
    console.log(resultado);
}