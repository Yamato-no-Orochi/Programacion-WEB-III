const express = require('express');
const app = express();
const PORT = 3009;

app.use(express.json());

let categorias = [
    {
        id: 1,
        nombre: "Electrónicos",
        descripcion: "Productos electrónicos y tecnológicos",
        fechaCreacion: "2024-01-15T10:30:00.000Z",
        fechaActualizacion: "2024-01-15T10:30:00.000Z"
    },
    {
        id: 2,
        nombre: "Ropa",
        descripcion: "Prendas de vestir para hombres, mujeres y niños",
        fechaCreacion: "2024-01-15T11:00:00.000Z",
        fechaActualizacion: "2024-01-15T11:00:00.000Z"
    },
    {
        id: 3,
        nombre: "Libros",
        descripcion: "Libros educativos y de entretenimiento",
        fechaCreacion: "2024-01-15T12:00:00.000Z",
        fechaActualizacion: "2024-01-15T12:00:00.000Z"
    }
];

let productos = [
    {
        id: 1,
        nombre: "Laptop HP Pavilion",
        precio: 899.99,
        stock: 15,
        categoriaId: 1,
        descripcion: "Laptop HP con 8GB RAM, 256GB SSD, Intel i5",
        fechaCreacion: "2024-01-15T10:35:00.000Z",
        fechaActualizacion: "2024-01-15T10:35:00.000Z",
        historialStock: [
            {
                fecha: "2024-01-15T10:35:00.000Z",
                cantidad: 15,
                tipo: "inicial",
                descripcion: "Stock inicial"
            }
        ]
    },
    {
        id: 2,
        nombre: "Smartphone Samsung Galaxy",
        precio: 599.99,
        stock: 25,
        categoriaId: 1,
        descripcion: "Smartphone Android con 128GB almacenamiento, 6GB RAM",
        fechaCreacion: "2024-01-15T10:40:00.000Z",
        fechaActualizacion: "2024-01-15T10:40:00.000Z",
        historialStock: [
            {
                fecha: "2024-01-15T10:40:00.000Z",
                cantidad: 25,
                tipo: "inicial",
                descripcion: "Stock inicial"
            }
        ]
    },
    {
        id: 3,
        nombre: "Camiseta Básica Algodón",
        precio: 19.99,
        stock: 50,
        categoriaId: 2,
        descripcion: "Camiseta 100% algodón unisex, varios colores",
        fechaCreacion: "2024-01-15T11:05:00.000Z",
        fechaActualizacion: "2024-01-15T11:05:00.000Z",
        historialStock: [
            {
                fecha: "2024-01-15T11:05:00.000Z",
                cantidad: 50,
                tipo: "inicial",
                descripcion: "Stock inicial"
            }
        ]
    },
    {
        id: 4,
        nombre: "Novela de Ciencia Ficción",
        precio: 15.99,
        stock: 5,
        categoriaId: 3,
        descripcion: "Best seller de ciencia ficción, edición especial",
        fechaCreacion: "2024-01-15T12:05:00.000Z",
        fechaActualizacion: "2024-01-15T12:05:00.000Z",
        historialStock: [
            {
                fecha: "2024-01-15T12:05:00.000Z",
                cantidad: 5,
                tipo: "inicial",
                descripcion: "Stock inicial"
            }
        ]
    }
];

let nextCategoriaId = 4;
let nextProductoId = 5;

app.post('/categorias', (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || !descripcion) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre y descripcion son requeridos'
            });
        }

        const nuevaCategoria = {
            id: nextCategoriaId++,
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        };

        categorias.push(nuevaCategoria);

        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: nuevaCategoria
        });

    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

app.get('/categorias', (req, res) => {
    try {
        res.json({
            success: true,
            count: categorias.length,
            data: categorias
        });

    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener las categorías'
        });
    }
});

app.post('/productos', (req, res) => {
    try {
        const { nombre, precio, stock, categoriaId, descripcion } = req.body;

        if (!nombre || !precio || !stock || !categoriaId) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, precio, stock y categoriaId son requeridos'
            });
        }

        const precioNumero = parseFloat(precio);
        if (isNaN(precioNumero) || precioNumero <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio debe ser un número mayor a 0'
            });
        }

        const stockNumero = parseInt(stock);
        if (isNaN(stockNumero) || stockNumero < 0) {
            return res.status(400).json({
                success: false,
                message: 'El stock debe ser un número entero mayor o igual a 0'
            });
        }

        const categoriaIdNumero = parseInt(categoriaId);
        const categoriaExiste = categorias.find(cat => cat.id === categoriaIdNumero);
        if (!categoriaExiste) {
            return res.status(400).json({
                success: false,
                message: `La categoría con ID ${categoriaIdNumero} no existe`
            });
        }

        const nuevoProducto = {
            id: nextProductoId++,
            nombre: nombre.trim(),
            precio: precioNumero,
            stock: stockNumero,
            categoriaId: categoriaIdNumero,
            descripcion: descripcion ? descripcion.trim() : '',
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
            historialStock: [
                {
                    fecha: new Date().toISOString(),
                    cantidad: stockNumero,
                    tipo: "inicial",
                    descripcion: "Stock inicial"
                }
            ]
        };

        productos.push(nuevoProducto);

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: nuevoProducto
        });

    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear el producto'
        });
    }
});

app.get('/productos', (req, res) => {
    try {
        const productosConCategoria = productos.map(producto => {
            const categoria = categorias.find(cat => cat.id === producto.categoriaId);
            return {
                ...producto,
                categoria: categoria ? {
                    id: categoria.id,
                    nombre: categoria.nombre
                } : null
            };
        });

        res.json({
            success: true,
            count: productos.length,
            data: productosConCategoria
        });

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener los productos'
        });
    }
});

app.get('/productos/:id', (req, res) => {
    try {
        const productoId = parseInt(req.params.id);

        if (isNaN(productoId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }

        const producto = productos.find(prod => prod.id === productoId);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: `Producto con ID ${productoId} no encontrado`
            });
        }

        const categoria = categorias.find(cat => cat.id === producto.categoriaId);

        const productoEnriquecido = {
            ...producto,
            categoria: categoria ? {
                id: categoria.id,
                nombre: categoria.nombre
            } : null
        };

        res.json({
            success: true,
            message: 'Producto encontrado exitosamente',
            data: productoEnriquecido
        });

    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener el producto'
        });
    }
});

app.patch('/productos/:id/stock', (req, res) => {
    try {
        const productoId = parseInt(req.params.id);
        const { cantidad, motivo } = req.body;

        if (isNaN(productoId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID del producto debe ser un número válido'
            });
        }

        if (cantidad === undefined || cantidad === null) {
            return res.status(400).json({
                success: false,
                message: 'El campo cantidad es requerido'
            });
        }

        const cantidadNumero = parseInt(cantidad);
        if (isNaN(cantidadNumero)) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser un número entero válido'
            });
        }

        const productoIndex = productos.findIndex(prod => prod.id === productoId);

        if (productoIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Producto con ID ${productoId} no encontrado`
            });
        }

        const producto = productos[productoIndex];
        const stockAnterior = producto.stock;
        const nuevoStock = stockAnterior + cantidadNumero;

        if (nuevoStock < 0) {
            return res.status(400).json({
                success: false,
                message: `No se puede decrementar ${Math.abs(cantidadNumero)} unidades. Stock actual: ${stockAnterior}. Stock resultante sería negativo.`,
                datos: {
                    stockActual: stockAnterior,
                    cantidadSolicitada: cantidadNumero,
                    stockResultante: nuevoStock
                }
            });
        }

        productos[productoIndex].stock = nuevoStock;
        productos[productoIndex].fechaActualizacion = new Date().toISOString();

        const movimientoStock = {
            fecha: new Date().toISOString(),
            cantidad: cantidadNumero,
            tipo: cantidadNumero > 0 ? "incremento" : "decremento",
            descripcion: motivo || (cantidadNumero > 0 ? "Incremento de stock" : "Decremento de stock"),
            stockAnterior: stockAnterior,
            stockNuevo: nuevoStock
        };

        productos[productoIndex].historialStock.push(movimientoStock);

        const categoria = categorias.find(cat => cat.id === producto.categoriaId);

        const respuesta = {
            success: true,
            message: `Stock actualizado exitosamente. ${cantidadNumero >= 0 ? 'Incrementado' : 'Decrementado'} ${Math.abs(cantidadNumero)} unidades.`,
            data: {
                producto: {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    stockAnterior: stockAnterior,
                    stockActual: nuevoStock,
                    cambio: cantidadNumero,
                    categoria: categoria ? {
                        id: categoria.id,
                        nombre: categoria.nombre
                    } : null,
                    fechaActualizacion: productos[productoIndex].fechaActualizacion
                },
                movimiento: movimientoStock,
                resumen: {
                    estado: nuevoStock > 10 ? "Disponible" : nuevoStock > 0 ? "Últimas unidades" : "Agotado",
                    valorTotalStock: (producto.precio * nuevoStock).toFixed(2)
                }
            }
        };

        res.json(respuesta);

    } catch (error) {
        console.error('Error al actualizar stock:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar el stock'
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'API de Gestión de Stock funcionando',
        description: 'Endpoint PATCH /productos/:id/stock permite incrementar o decrementar el stock',
        endpoints: {
            'POST /categorias': 'Crear nueva categoría',
            'GET /categorias': 'Obtener todas las categorías',
            'POST /productos': 'Crear nuevo producto',
            'GET /productos': 'Obtener todos los productos',
            'GET /productos/:id': 'Obtener producto por ID',
            'PATCH /productos/:id/stock': 'ACTUALIZAR stock de producto'
        },
        datosIniciales: {
            totalCategorias: categorias.length,
            totalProductos: productos.length,
            productosConStock: productos.map(prod => ({
                id: prod.id,
                nombre: prod.nombre,
                stock: prod.stock,
                categoria: categorias.find(cat => cat.id === prod.categoriaId)?.nombre
            }))
        },
        ejemplosUso: {
            'Incrementar stock': {
                metodo: 'PATCH',
                url: '/productos/1/stock',
                body: {
                    cantidad: 10,
                    motivo: "Reposición de inventario"
                }
            },
            'Decrementar stock': {
                metodo: 'PATCH',
                url: '/productos/2/stock',
                body: {
                    cantidad: -5,
                    motivo: "Venta realizada"
                }
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Categorías precargadas: ${categorias.length}`);
    console.log(`📦 Productos precargados: ${productos.length}`);
    console.log(`🔄 Endpoint PATCH /productos/:id/stock disponible`);
});