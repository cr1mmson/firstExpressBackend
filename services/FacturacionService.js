const facturaRepository = require('../db/facturaRepository');

class FacturacionService {
    async procesarVentaCompleta(datosVenta) {
        // datosVenta viene de Postman: { nombre, direccion, nit, total, productos: [{idProducto, cantidad}, ...] }
        try {
            
            // 1. Abrimos el encabezado de la factura
            const idFactura = await facturaRepository.abrirFactura(
                datosVenta.nombre,
                datosVenta.direccion,
                datosVenta.nit,
                datosVenta.total,
                datosVenta.metodoPago
            );

            // 2. Agregamos cada producto del arreglo a la misma factura
            // Usamos for...of para asegurar que SQL procese uno tras otro correctamente
            for (const item of datosVenta.productos) {
                await facturaRepository.agregarDetalle(
                    idFactura,
                    item.idProducto,
                    item.cantidad
                );
            }

            return {
                success: true,
                message: "Factura generada y stock actualizado con éxito",
                idFactura: idFactura
            };
        } catch (error) {
            console.error("Error en FacturacionService:", error.message);
            throw error; // Re-lanzamos el error para que la ruta lo capture
        }
    }

    async obtenerHistorial() {
        return await facturaRepository.obtenerTodas();
    }

    async obtenerDetalleFactura(id) {
        const factura = await facturaRepository.obtenerPorId(id);
        if (!factura) {
            throw new Error('La factura solicitada no existe');
        }
        return factura;
    }
    
    async anularVenta(idFactura) {
    try {
        await facturaRepository.anularFactura(idFactura);
        return {
            success: true,
            message: `Factura ${idFactura} anulada con éxito. El inventario ha sido devuelto.`
        };
    } catch (error) {
        console.error("Error al anular en FacturacionService:", error.message);
        throw error;
    }
    }
}

module.exports = new FacturacionService();