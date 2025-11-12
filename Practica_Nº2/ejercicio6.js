const express = require('express');
const app = express();
const PORT = 3005;

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
        nombre: "Laptop HP",
        precio: 899.99,
        stock: 15,
        categoriaId: 1,
        descripcion: "Laptop HP con 8GB RAM y 256GB SSD",
        fechaCreacion: "2024-01-15T10:35:00.000Z",
        fechaActualizacion: "2024-01-15T10:35:00.000Z"
    },
    {
        id: 2,
        nombre: "Camiseta Básica",
        precio: 19.99,
        stock: 50,
        categoriaId: 2,
        descripcion: "Camiseta 100% algodón unisex",
        fechaCreacion: "2024-01-15T11:05:00.000Z",
        fechaActualizacion: "2024-01-15T11:05:00.000Z"
    }
];

let nextCategoriaId = 4;
let nextProductoId = 3;

app.post('/categorias', (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || !descripcion) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre y descripcion son requeridos'
            });
        }

        if (nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre no puede estar vacío'
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

app.post('/productos', (req, res) => {
    try {
        const { nombre, precio, stock, categoriaId, descripcion } = req.body;

        if (!nombre || !precio || !stock || !categoriaId) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, precio, stock y categoriaId son requeridos'
            });
        }

        if (nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre no puede estar vacío'
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
        if (isNaN(categoriaIdNumero)) {
            return res.status(400).json({
                success: false,
                message: 'El categoriaId debe ser un número válido'
            });
        }

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
            fechaActualizacion: new Date().toISOString()
        };

        productos.push(nuevoProducto);

        const respuestaEnriquecida = {
            ...nuevoProducto,
            categoria: {
                id: categoriaExiste.id,
                nombre: categoriaExiste.nombre
            }
        };

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: respuestaEnriquecida
        });

    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al crear el producto'
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'API de Productos con POST funcionando',
        endpoints: {
            'POST /categorias': 'Crear nueva categoría',
            'GET /categorias': 'Obtener todas las categorías',
            'POST /productos': 'CREAR nuevo producto',
            'GET /productos': 'Obtener todos los productos'
        },
        datosIniciales: {
            categorias: categorias.length,
            productos: productos.length,
            categoriasDisponibles: categorias.map(cat => ({ id: cat.id, nombre: cat.nombre })),
            ejemploProducto: {
                nombre: "Smartphone Samsung",
                precio: 599.99,
                stock: 25,
                categoriaId: 1,
                descripcion: "Smartphone Android con 128GB"
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Categorías precargadas: ${categorias.length}`);
    console.log(`📦 Productos precargados: ${productos.length}`);
    console.log(`🆕 Endpoint POST /productos disponible`);
});