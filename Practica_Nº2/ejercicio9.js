const express = require('express');
const app = express();
const PORT = 3008;

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
        fechaActualizacion: "2024-01-15T10:35:00.000Z",
        historialCambios: [
            {
                fecha: "2024-01-15T10:35:00.000Z",
                tipo: "creacion",
                descripcion: "Producto creado inicialmente"
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
        caracteristicas: ["128GB Almacenamiento", "6GB RAM", "Cámara 48MP", "5G"],
        fechaCreacion: "2024-01-15T10:40:00.000Z",
        fechaActualizacion: "2024-01-15T10:40:00.000Z",
        historialCambios: [
            {
                fecha: "2024-01-15T10:40:00.000Z",
                tipo: "creacion",
                descripcion: "Producto creado inicialmente"
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
        caracteristicas: ["100% Algodón", "Unisex", "Multiple colores", "Tallas S-XXL"],
        fechaCreacion: "2024-01-15T11:05:00.000Z",
        fechaActualizacion: "2024-01-15T11:05:00.000Z",
        historialCambios: [
            {
                fecha: "2024-01-15T11:05:00.000Z",
                tipo: "creacion",
                descripcion: "Producto creado inicialmente"
            }
        ]
    }
];

let nextCategoriaId = 5;
let nextProductoId = 4;

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
        const { nombre, precio, stock, categoriaId, descripcion, caracteristicas } = req.body;

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
            caracteristicas: caracteristicas || [],
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
            historialCambios: [
                {
                    fecha: new Date().toISOString(),
                    tipo: "creacion",
                    descripcion: "Producto creado inicialmente"
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
                nombre: categoria.nombre,
                descripcion: categoria.descripcion
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

app.put('/productos/:id', (req, res) => {
    try {
        const productoId = parseInt(req.params.id);
        const { nombre, precio, stock, categoriaId, descripcion, caracteristicas } = req.body;

        if (isNaN(productoId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID del producto debe ser un número válido'
            });
        }

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

        const productoIndex = productos.findIndex(prod => prod.id === productoId);

        if (productoIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Producto con ID ${productoId} no encontrado`
            });
        }

        const productoOriginal = { ...productos[productoIndex] };
        const cambios = [];

        if (productoOriginal.nombre !== nombre.trim()) {
            cambios.push(`Nombre: "${productoOriginal.nombre}" → "${nombre}"`);
        }
        if (productoOriginal.precio !== precioNumero) {
            cambios.push(`Precio: $${productoOriginal.precio} → $${precioNumero}`);
        }
        if (productoOriginal.stock !== stockNumero) {
            cambios.push(`Stock: ${productoOriginal.stock} → ${stockNumero}`);
        }
        if (productoOriginal.categoriaId !== categoriaIdNumero) {
            const catAnterior = categorias.find(cat => cat.id === productoOriginal.categoriaId)?.nombre || 'Desconocida';
            const catNueva = categorias.find(cat => cat.id === categoriaIdNumero)?.nombre || 'Desconocida';
            cambios.push(`Categoría: "${catAnterior}" → "${catNueva}"`);
        }
        if (productoOriginal.descripcion !== (descripcion ? descripcion.trim() : '')) {
            cambios.push(`Descripción actualizada`);
        }

        productos[productoIndex] = {
            ...productos[productoIndex],
            nombre: nombre.trim(),
            precio: precioNumero,
            stock: stockNumero,
            categoriaId: categoriaIdNumero,
            descripcion: descripcion ? descripcion.trim() : '',
            caracteristicas: caracteristicas || [],
            fechaActualizacion: new Date().toISOString()
        };

        if (cambios.length > 0) {
            productos[productoIndex].historialCambios.push({
                fecha: new Date().toISOString(),
                tipo: "actualizacion",
                descripcion: `Producto actualizado: ${cambios.join(', ')}`,
                cambios: cambios
            });
        }

        const nuevaCategoria = categorias.find(cat => cat.id === categoriaIdNumero);

        const respuesta = {
            success: true,
            message: 'Producto actualizado exitosamente',
            data: {
                producto: {
                    id: productos[productoIndex].id,
                    nombre: productos[productoIndex].nombre,
                    precio: productos[productoIndex].precio,
                    stock: productos[productoIndex].stock,
                    descripcion: productos[productoIndex].descripcion,
                    caracteristicas: productos[productoIndex].caracteristicas,
                    categoriaId: productos[productoIndex].categoriaId,
                    fechaCreacion: productos[productoIndex].fechaCreacion,
                    fechaActualizacion: productos[productoIndex].fechaActualizacion
                },
                categoria: nuevaCategoria ? {
                    id: nuevaCategoria.id,
                    nombre: nuevaCategoria.nombre,
                    descripcion: nuevaCategoria.descripcion
                } : null,
                cambios: {
                    cantidad: cambios.length,
                    detalles: cambios,
                    resumen: `Se actualizaron ${cambios.length} campo(s) del producto`
                }
            }
        };

        res.json(respuesta);

    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar el producto'
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'API de Actualización de Productos funcionando',
        description: 'Endpoint PUT /productos/:id permite actualizar todos los datos de un producto',
        endpoints: {
            'POST /categorias': 'Crear nueva categoría',
            'GET /categorias': 'Obtener todas las categorías',
            'POST /productos': 'Crear nuevo producto',
            'GET /productos': 'Obtener todos los productos',
            'GET /productos/:id': 'Obtener producto por ID',
            'PUT /productos/:id': 'ACTUALIZAR producto completo'
        },
        datosIniciales: {
            totalCategorias: categorias.length,
            totalProductos: productos.length,
            categoriasDisponibles: categorias.map(cat => ({
                id: cat.id,
                nombre: cat.nombre
            })),
            productosEjemplo: productos.map(prod => ({
                id: prod.id,
                nombre: prod.nombre,
                categoriaActual: categorias.find(cat => cat.id === prod.categoriaId)?.nombre
            }))
        },
        ejemplosUso: {
            'Actualizar producto': {
                metodo: 'PUT',
                url: '/productos/1',
                body: {
                    nombre: "Laptop HP Pavilion Actualizada",
                    precio: 949.99,
                    stock: 20,
                    categoriaId: 1,
                    descripcion: "Laptop HP actualizada con mejores especificaciones",
                    caracteristicas: ["16GB RAM", "512GB SSD", "Intel i7", "15.6 pulgadas FHD"]
                }
            },
            'Cambiar categoría': {
                metodo: 'PUT',
                url: '/productos/2',
                body: {
                    nombre: "Smartphone Samsung Galaxy",
                    precio: 549.99,
                    stock: 30,
                    categoriaId: 4, 
                    descripcion: "Smartphone re-categorizado",
                    caracteristicas: ["128GB", "6GB RAM", "5G"]
                }
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Categorías precargadas: ${categorias.length}`);
    console.log(`📦 Productos precargados: ${productos.length}`);
    console.log(`🔄 Endpoint PUT /productos/:id disponible para actualizaciones completas`);
});