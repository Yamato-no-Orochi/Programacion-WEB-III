// Antes
setTimeout(() => {
    console.log("Paso 1");
    setTimeout(() => {
        console.log("Paso 2");
    }, 1000);
}, 1000);
// Despues
async function ejecutar() {
    await new Promise(r => setTimeout(r, 1000));
    console.log("Paso 1");
    await new Promise(r => setTimeout(r, 1000));
    console.log("Paso 2");
}
ejecutar();