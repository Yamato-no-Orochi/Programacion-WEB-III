const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

let categorias = [
    {
        id: 1,
        nombre: "Electrónicos",
        descripcion: "Productos electrónicos y tecnológicos",
        fechaCreacion: "2024-01-15T10:30:00.000Z"
    },
    {
        id: 2,
        nombre: "Ropa",
        descripcion: "Prendas de vestir para hombres, mujeres y niños",
        fechaCreacion: "2024-01-15T11:00:00.000Z"
    },
    {
        id: 3,
        nombre: "Libros",
        descripcion: "Libros educativos y de entretenimiento",
        fechaCreacion: "2024-01-15T12:00:00.000Z"
    }
];

let productos = [
    {
        id: 1,
        nombre: "Laptop HP",
        precio: 899.99,
        categoriaId: 1,
        descripcion: "Laptop HP con 8GB RAM y 256GB SSD"
    },
    {
        id: 2,
        nombre: "Smartphone Samsung",
        precio: 599.99,
        categoriaId: 1,
        descripcion: "Smartphone Android con 128GB almacenamiento"
    },
    {
        id: 3,
        nombre: "Camiseta Casual",
        precio: 24.99,
        categoriaId: 2,
        descripcion: "Camiseta 100% algodón"
    },
    {
        id: 4,
        nombre: "Jeans",
        precio: 49.99,
        categoriaId: 2,
        descripcion: "Jeans ajustados color azul"
    },
    {
        id: 5,
        nombre: "Novela Best Seller",
        precio: 19.99,
        categoriaId: 3,
        descripcion: "Novela más vendida del año"
    }
];

let nextCategoriaId = 4;
let nextProductoId = 6;

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
            fechaCreacion: new Date().toISOString()
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

app.get('/categorias/:id', (req, res) => {
    try {
        const categoriaId = parseInt(req.params.id);

        if (isNaN(categoriaId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }

        const categoria = categorias.find(cat => cat.id === categoriaId);

        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: `Categoría con ID ${categoriaId} no encontrada`
            });
        }

        const productosDeLaCategoria = productos.filter(
            producto => producto.categoriaId === categoriaId
        );

        const respuesta = {
            success: true,
            data: {
                ...categoria,
                productos: productosDeLaCategoria,
                totalProductos: productosDeLaCategoria.length
            }
        };

        res.json(respuesta);

    } catch (error) {
        console.error('Error al obtener categoría por ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener la categoría'
        });
    }
});

app.post('/productos', (req, res) => {
    try {
        const { nombre, precio, categoriaId, descripcion } = req.body;

        if (!nombre || !precio || !categoriaId) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, precio y categoriaId son requeridos'
            });
        }

        const categoriaExiste = categorias.find(cat => cat.id === parseInt(categoriaId));
        if (!categoriaExiste) {
            return res.status(400).json({
                success: false,
                message: 'La categoría especificada no existe'
            });
        }

        const nuevoProducto = {
            id: nextProductoId++,
            nombre: nombre.trim(),
            precio: parseFloat(precio),
            categoriaId: parseInt(categoriaId),
            descripcion: descripcion ? descripcion.trim() : ''
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
            message: 'Error interno del servidor'
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'API de Categorías y Productos funcionando',
        endpoints: {
            'POST /categorias': 'Crear nueva categoría',
            'GET /categorias': 'Obtener todas las categorías',
            'GET /categorias/:id': 'Obtener categoría por ID con sus productos',
            'POST /productos': 'Crear nuevo producto'
        },
        datosEjemplo: {
            categorias: categorias.length,
            productos: productos.length
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Categorías precargadas: ${categorias.length}`);
    console.log(`📦 Productos precargados: ${productos.length}`);
});