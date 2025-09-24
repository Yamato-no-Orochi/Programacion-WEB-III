// Callback
function callbackEjemplo(cb) {
    setTimeout(() => cb(null, "datos"), 1000);
}

// Promesa
function promesaEjemplo() {
    return new Promise((resolve, reject) => {
        callbackEjemplo((err, data) => err ? reject(err) : resolve(data));
    });
}