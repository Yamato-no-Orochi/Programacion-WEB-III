const express = require('express');
const app = express();
const PORT = 3001;

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
    }
];
let nextId = 3;

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
            id: nextId++,
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

app.get('/', (req, res) => {
    res.json({
        message: 'API de Categorías funcionando',
        endpoints: {
            'POST /categorias': 'Crear nueva categoría',
            'GET /categorias': 'Obtener todas las categorías'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Categorías precargadas: ${categorias.length}`);
});