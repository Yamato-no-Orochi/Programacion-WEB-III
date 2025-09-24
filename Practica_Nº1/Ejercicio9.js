new Promise(resolve => {
    setTimeout(() => resolve("Éxito"), 3000);
}).then(mensaje => console.log(mensaje));