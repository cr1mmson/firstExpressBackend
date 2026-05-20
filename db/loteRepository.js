const {getPool, sql} = require('./connection');

async function crear(idLote, idProducto, cantidad, fechaVencimiento) {
    fechaIngreso = new Date(); 
    const pool = await getPool();
    await pool.request()
        .input('idLote', sql.VarChar, idLote)
        .input('idProducto', sql.VarChar, idProducto)
        .input('cantidad', sql.Int, cantidad)
        .input('fechaVencimiento', sql.Date, fechaVencimiento)
        .input('fechaIngreso', sql.Date, fechaIngreso)
        .query('INSERT INTO Lote (idLote, idProducto, cantidad, fechaVencimiento, fechaIngreso) VALUES (@idLote, @idProducto, @cantidad, @fechaVencimiento, @fechaIngreso)');
}

async function eliminar(id) {
    const pool = await getPool();
    await pool.request()
        .input('idLote', sql.VarChar, id)
        .query('DELETE FROM Lote WHERE idLote = @idLote');
}

async function obtenerTodos(){
    const pool = await getPool();
    result = await pool.request()
        .query('SELECT * FROM Lote');
    return result.recordset;
}

async function editarUnLote(idLote, cantidad){
    const pool = await getPool();
    result = await pool.request()
        .input('idLote', sql.VarChar, idLote)
        .input('cantidad', sql.Int, cantidad)
        .query('UPDATE Lote SET cantidad = @cantidad WHERE idLote = @idLote');
    return result;
}   

async function obtenerUnLote(idLote){
    const pool = await getPool();
    result = await pool.request()
        .input('idLote', sql.VarChar, idLote)
        .query('SELECT * FROM Lote WHERE idLote = @idLote');
    return result.recordset[0];
}

async function venderProducto(idLote, cantidadVendida){
    const pool = await getPool();
    result = await pool.request()
         .input('idProducto', sql.VarChar, idLote)
         .input('cantidadVendida', sql.Int, cantidadVendida)
         .query('EXEC Inv.sp_VenderFIFO @ProductoID = @idProducto, @CantidadToVender = @cantidadVendida;')
    return result;
}

async function obtenerProximosAVencer() {
  diasUmbral = 30
  const pool = await getPool();
  const result = await pool.request()
    .input('dias', sql.Int, diasUmbral)
    .query(`
      SELECT l.*, p.nombre
      FROM Lote l
      JOIN Producto p ON l.idProducto = p.idProducto
      WHERE l.fechaVencimiento <= DATEADD(DAY, @dias, GETDATE())
        AND l.cantidad > 0
      ORDER BY l.fechaVencimiento ASC
    `);
  return result.recordset;
}

async function editar(idLote, cantidad){
    const pool = await getPool();
    await pool.request()
        .input('idLote', sql.VarChar, idLote)
        .input('cantidad', sql.Int, cantidad)
        .query('UPDATE Lote SET cantidad = @cantidad WHERE idLote = @idLote');
}

module.exports = {crear, eliminar, obtenerTodos, editarUnLote, obtenerUnLote, venderProducto, obtenerProximosAVencer};   