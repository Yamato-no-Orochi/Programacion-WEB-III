function mayorMenor(numeros) {
    return {
        mayor: Math.max(...numeros),
        menor: Math.min(...numeros)
    };
}

console.log(mayorMenor([3,1,5,4,2])); // {mayor:5, menor:1}