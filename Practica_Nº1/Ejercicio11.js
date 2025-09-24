Promise.resolve(5)
    .then(n => n * 2)
    .then(n => n + 1)
    .then(resultado => console.log(resultado)); // 11