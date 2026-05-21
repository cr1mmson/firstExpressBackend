const productoDB = require('../db/productoRepository');
const loteDB = require('../db/loteRepository');
const Lote = require('../models/Lote');

class InventarioService {

   async registrarProducto({id, nombre, descripcion, precio}) {
        if(id == null && nombre == null && descripcion == null && precio == null){
            throw new Error('Todos los campos son obligatorios');
        }

        await productoDB.crear(id, nombre, descripcion, precio);
    }

    async obtenerProductos(){
        return await productoDB.obtenerTodos();
    }

    async registrarLote({idLote, idProducto, cantidad, fechaVencimiento}){
        await loteDB.crear(idLote, idProducto, cantidad, fechaVencimiento);
    }

    async obtenerLotes(){
        return await loteDB.obtenerTodos();
    }

    async venderProducto(idProducto, cantidadVendida){
        await loteDB.venderProducto(idProducto, cantidadVendida);
    }

    async obtenerProximosAVencer() {
        return await loteDB.obtenerProximosAVencer();
    }

    async eliminarProducto(id){
        await productoDB.borrar(id);
    }

    async editarProducto(id, nombre, descripcion, precio){
        await productoDB.editar(id, nombre, descripcion, precio);
    }

    async editarLotes(idLote, cantidad){
        await loteDB.editarUnLote(idLote, cantidad);
    }

    async eliminarLote(id){
        await loteDB.eliminar(id);
    }
}

module.exports = new InventarioService();