const express = require('express');
const app = express();
const PORT = 3004;

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
        categoriaId: 1,
        descripcion: "Laptop HP con 8GB RAM y 256GB SSD",
        fechaCreacion: "2024-01-15T10:35:00.000Z"
    },
    {
        id: 2,
        nombre: "Smartphone Samsung",
        precio: 599.99,
        categoriaId: 1,
        descripcion: "Smartphone Android con 128GB almacenamiento",
        fechaCreacion: "2024-01-15T10:40:00.000Z"
    },
    {
        id: 3,
        nombre: "Camiseta Casual",
        precio: 24.99,
        categoriaId: 2,
        descripcion: "Camiseta 100% algodón",
        fechaCreacion: "2024-01-15T11:05:00.000Z"
    },
    {
        id: 4,
        nombre: "Jeans",
        precio: 49.99,
        categoriaId: 2,
        descripcion: "Jeans ajustados color azul",
        fechaCreacion: "2024-01-15T11:10:00.000Z"
    },
    {
        id: 5,
        nombre: "Novela Best Seller",
        precio: 19.99,
        categoriaId: 3,
        descripcion: "Novela más vendida del año",
        fechaCreacion: "2024-01-15T12:05:00.000Z"
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

        const productosCategoria = productos.filter(prod => prod.categoriaId === categoriaId);

        res.json({
            success: true,
            data: {
                ...categoria,
                productos: productosCategoria,
                totalProductos: productosCategoria.length
            }
        });

    } catch (error) {
        console.error('Error al obtener categoría por ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener la categoría'
        });
    }
});

app.put('/categorias/:id', (req, res) => {
    try {
        const categoriaId = parseInt(req.params.id);
        const { nombre, descripcion } = req.body;

        if (isNaN(categoriaId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }

        if (!nombre || !descripcion) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre y descripcion son requeridos para la actualización'
            });
        }

        if (nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre no puede estar vacío'
            });
        }

        const categoriaIndex = categorias.findIndex(cat => cat.id === categoriaId);

        if (categoriaIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Categoría con ID ${categoriaId} no encontrada`
            });
        }

        const fechaCreacionOriginal = categorias[categoriaIndex].fechaCreacion;

        categorias[categoriaIndex] = {
            ...categorias[categoriaIndex],
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            fechaActualizacion: new Date().toISOString(),
            fechaCreacion: fechaCreacionOriginal
        };

        res.json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: categorias[categoriaIndex]
        });

    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar la categoría'
        });
    }
});

app.delete('/categorias/:id', (req, res) => {
    try {
        const categoriaId = parseInt(req.params.id);

        if (isNaN(categoriaId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }

        const categoriaIndex = categorias.findIndex(cat => cat.id === categoriaId);

        if (categoriaIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Categoría con ID ${categoriaId} no encontrada`
            });
        }

        const categoriaEliminada = categorias[categoriaIndex];

        const productosAEliminar = productos.filter(prod => prod.categoriaId === categoriaId);
        const cantidadProductos = productosAEliminar.length;

        categorias.splice(categoriaIndex, 1);

        productos = productos.filter(prod => prod.categoriaId !== categoriaId);

        res.json({
            success: true,
            message: `Categoría eliminada exitosamente junto con ${cantidadProductos} productos`,
            data: {
                categoria: categoriaEliminada,
                productosEliminados: cantidadProductos,
                detalles: `Se eliminó la categoría '${categoriaEliminada.nombre}' y ${cantidadProductos} producto(s) asociado(s)`
            }
        });

    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar la categoría'
        });
    }
});

app.get('/productos', (req, res) => {
    try {
        res.json({
            success: true,
            count: productos.length,
            data: productos
        });

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener los productos'
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'API de Categorías con DELETE funcionando',
        endpoints: {
            'POST /categorias': 'Crear nueva categoría',
            'GET /categorias': 'Obtener todas las categorías',
            'GET /categorias/:id': 'Obtener categoría por ID con productos',
            'PUT /categorias/:id': 'Actualizar categoría por ID',
            'DELETE /categorias/:id': 'ELIMINAR categoría y sus productos',
            'GET /productos': 'Obtener todos los productos'
        },
        datosIniciales: {
            categorias: categorias.length,
            productos: productos.length,
            ejemploEliminacion: 'DELETE /categorias/1 - Eliminará la categoría Electrónicos y 2 productos'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Categorías precargadas: ${categorias.length}`);
    console.log(`📦 Productos precargados: ${productos.length}`);
    console.log(`🗑️  Endpoint DELETE disponible: http://localhost:${PORT}/categorias/:id`);
});