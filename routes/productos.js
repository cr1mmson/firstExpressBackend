const router = require('express').Router();
const inventario = require('../services/InventarioService');

router.post('/', async (req, res) => {
    try {
        const {id, nombre, descripcion, precio} = req.body;

        if (!id || !nombre || !descripcion || !precio) {
            return res.status(400).json({error: 'Todos los campos son obligatorios'});
        }
        await inventario.registrarProducto({id, nombre, descripcion, precio});
        res.status(201).json({message: 'Producto registrado exitosamente'});

    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.get('/', async (req, res) => {
    try {
        const productos = await inventario.obtenerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({error: 'Error al obtener los productos'});
    }
});

module.exports = router;
