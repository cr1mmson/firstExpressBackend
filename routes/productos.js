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

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await inventario.eliminarProducto(id);
        res.json({message: 'Producto eliminado exitosamente'});
    } catch (error) {
        res.status(500).json({error: 'Error al eliminar el producto'});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {nombre, descripcion, precio} = req.body;

        await inventario.editarProducto(id, nombre, descripcion, precio);
        res.json({message: 'Producto actualizado exitosamente'});
    } catch (error) {
        res.status(500).json({error: 'Error al actualizar el producto'});
    }
});

module.exports = router;
