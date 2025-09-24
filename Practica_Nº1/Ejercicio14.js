// Promesa
function promesa() {
    return Promise.resolve("éxito");
}

// Callback
function callback(cb) {
    promesa().then(resultado => cb(null, resultado));
}