function esPalindromo(texto) {
    return texto === texto.split('').reverse().join('');
}

console.log(esPalindromo("oruro")); // true
console.log(esPalindromo("hola")); // false