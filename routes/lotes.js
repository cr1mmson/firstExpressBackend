const router = require('express').Router();
const inventario = require('../services/InventarioService');

router.post('/', async (req, res) => {
    try{
        const {idLote, idProducto, cantidad, fechaVencimiento} = req.body;
        if (!idLote || !idProducto || !cantidad || !fechaVencimiento) {
            console.log('Campos faltantes:', {idLote, idProducto, cantidad, fechaVencimiento});
            return res.status(400).json({error: 'Todos los campos son obligatorios'});
        }
        await inventario.registrarLote({idLote,  idProducto, cantidad, fechaVencimiento});
        res.status(201).json({message: 'Lote registrado exitosamente'});
    }catch(error){
        res.status(400).json({error: error.message});   
    }
});

router.post('/vender', async(req,res)=>{
    try{
        const {idProducto, cantidadVendida} = req.body;
        if(!idProducto || !cantidadVendida){
            console.log('Campos faltantes:', {idProducto, cantidadVendida});
            return res.status(400).json({error: 'Todos los campos son obligatorios'});
        }
        await inventario.venderProducto(idProducto, cantidadVendida);
        res.status(201).json({message: 'Producto vendido exitosamente'});
    }catch(error){
        res.status(400).json({error: error.message});
    }
});

router.get('/', async (req, res) => {
    try {
        const lotes = await inventario.obtenerLotes();
        res.json(lotes);
    } catch (error) {
        res.status(500).json({error: 'Error al obtener los lotes'});
    }
});

router.get('/alertas', async(req, res) =>{
    try{
        const proximosAVencer = await inventario.obtenerProximosAVencer();
        res.json(proximosAVencer);
    } catch (error) {
        res.status(500).json({error: 'Error al obtener los productos próximos a vencer'});
    }
});

router.put('/:idLote', async(req, res) => {
    try{
        const {idLote} = req.params;
        const {cantidad} = req.body;
        if(!cantidad){
            console.log('Campo faltante:', {cantidad});
            return res.status(400).json({error: 'El campo cantidad es obligatorio'});
        }
        await inventario.editarLotes(idLote, cantidad);
        res.json({message: 'Lote actualizado exitosamente'});
    }catch(error){
        res.status(400).json({error: error.message});
    }   
});

router.delete('/:idLote', async(req, res) => {
    try{
        const {idLote} = req.params;
        await inventario.eliminarLote(idLote);
        res.json({message: 'Lote eliminado exitosamente'});
    }catch(error){
        res.status(400).json({error: error.message});
    }
});

module.exports = router;
