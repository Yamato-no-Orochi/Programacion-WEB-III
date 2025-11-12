const express = require('express');
const app = express();
const PORT = 3003;

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

let nextCategoriaId = 4;

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

        res.json({
            success: true,
            data: categoria
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

app.get('/', (req, res) => {
    res.json({
        message: 'API de Categorías con PUT funcionando',
        endpoints: {
            'POST /categorias': 'Crear nueva categoría',
            'GET /categorias': 'Obtener todas las categorías',
            'GET /categorias/:id': 'Obtener categoría por ID',
            'PUT /categorias/:id': 'Actualizar categoría por ID'
        },
        datosIniciales: {
            categorias: categorias.length,
            ejemploActualizacion: {
                url: 'PUT /categorias/1',
                body: {
                    nombre: "Nuevo nombre",
                    descripcion: "Nueva descripción"
                }
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Categorías precargadas: ${categorias.length}`);
    console.log(`🔄 Endpoint PUT disponible: http://localhost:${PORT}/categorias/:id`);
});