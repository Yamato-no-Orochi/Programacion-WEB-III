const express = require('express');
const app = express();
const PORT = 3007;

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
    },
    {
        id: 4,
        nombre: "Hogar",
        descripcion: "Productos para el hogar y decoración",
        fechaCreacion: "2024-01-15T13:00:00.000Z",
        fechaActualizacion: "2024-01-15T13:00:00.000Z"
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
        caracteristicas: ["8GB RAM", "256GB SSD", "Intel i5", "15.6 pulgadas"],
        fechaCreacion: "2024-01-15T10:35:00.000Z",
        fechaActualizacion: "2024-01-15T10:35:00.000Z"
    },
    {
        id: 2,
        nombre: "Smartphone Samsung Galaxy",
        precio: 599.99,
        stock: 25,
        categoriaId: 1,
        descripcion: "Smartphone Android con 128GB almacenamiento, 6GB RAM",
        caracteristicas: ["128GB Almacenamiento", "6GB RAM", "Cámara 48MP", "5G"],
        fechaCreacion: "2024-01-15T10:40:00.000Z",
        fechaActualizacion: "2024-01-15T10:40:00.000Z"
    },
    {
        id: 3,
        nombre: "Camiseta Básica Algodón",
        precio: 19.99,
        stock: 50,
        categoriaId: 2,
        descripcion: "Camiseta 100% algodón unisex, varios colores",
        caracteristicas: ["100% Algodón", "Unisex", "Multiple colores", "Tallas S-XXL"],
        fechaCreacion: "2024-01-15T11:05:00.000Z",
        fechaActualizacion: "2024-01-15T11:05:00.000Z"
    },
    {
        id: 4,
        nombre: "Novela de Ciencia Ficción",
        precio: 15.99,
        stock: 40,
        categoriaId: 3,
        descripcion: "Best seller de ciencia ficción, edición especial",
        caracteristicas: ["Tapa dura", "450 páginas", "Edición especial", "Incluye bookmark"],
        fechaCreacion: "2024-01-15T12:05:00.000Z",
        fechaActualizacion: "2024-01-15T12:05:00.000Z"
    }
];

let nextCategoriaId = 5;
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

app.post('/productos', (req, res) => {
    try {
        const { nombre, precio, stock, categoriaId, descripcion, caracteristicas } = req.body;

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
            caracteristicas: caracteristicas || [],
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

        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: `Categoría del producto no encontrada`
            });
        }

        const productoEnriquecido = {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion,
            caracteristicas: producto.caracteristicas,
            categoriaId: producto.categoriaId,
            fechaCreacion: producto.fechaCreacion,
            fechaActualizacion: producto.fechaActualizacion,
            categoria: {
                id: categoria.id,
                nombre: categoria.nombre,
                descripcion: categoria.descripcion,
                fechaCreacion: categoria.fechaCreacion
            },
            valorTotalStock: producto.precio * producto.stock,
            disponible: producto.stock > 0,
            estadoStock: producto.stock > 10 ? "Disponible" : 
                         producto.stock > 0 ? "Últimas unidades" : "Agotado"
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

app.get('/', (req, res) => {
    res.json({
        message: 'API de Producto por ID funcionando',
        description: 'Endpoint GET /productos/:id muestra un producto específico con información completa de su categoría',
        endpoints: {
            'POST /categorias': 'Crear nueva categoría',
            'GET /categorias': 'Obtener todas las categorías',
            'POST /productos': 'Crear nuevo producto',
            'GET /productos': 'Obtener todos los productos',
            'GET /productos/:id': 'OBTENER producto por ID con categoría'
        },
        datosIniciales: {
            totalCategorias: categorias.length,
            totalProductos: productos.length,
            productosEjemplo: productos.map(prod => ({
                id: prod.id,
                nombre: prod.nombre,
                categoriaId: prod.categoriaId
            }))
        },
        ejemplosUso: {
            'Producto 1': 'GET /productos/1 - Laptop HP con categoría Electrónicos',
            'Producto 3': 'GET /productos/3 - Camiseta con categoría Ropa',
            'Producto 4': 'GET /productos/4 - Novela con categoría Libros'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Categorías precargadas: ${categorias.length}`);
    console.log(`📦 Productos precargados: ${productos.length}`);
    console.log(`🔍 Endpoint GET /productos/:id disponible con información de categoría`);
});