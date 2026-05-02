class Lote{

    constructor({loteID, productoId, fechaVencimiento, cantidad, fechaIngreso}){
        this.loteID = loteID;
        this.productoId = productoId;
        this.fechaVencimiento = fechaVencimiento;
        this.fechaIngreso = fechaIngreso;
        this.cantidad = cantidad;
    }

}

module.exports = Lote;