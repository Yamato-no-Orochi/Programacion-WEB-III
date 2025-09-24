function contarVocales(texto) {
  let resultado = { a: 0, e: 0, i: 0, o: 0, u: 0 };
  for (let letra of texto.toLowerCase()) {
    if (resultado.hasOwnProperty(letra)) {
      resultado[letra]++;
    }
  }
  return resultado;
}

console.log(contarVocales("euforia")); // { a: 1, e: 1, i: 1, o: 1, u: 1 }