const {getPool, sql} = require('./connection');

async function crear(id, nombre, descripcion, precio) {
  const pool = await getPool();
  await pool.request()
    .input('idProducto', sql.VarChar, id)
    .input('nombre', sql.VarChar, nombre)
    .input('descripcion', sql.VarChar, descripcion)
    .input('precio', sql.Decimal(8, 2), precio)
    .query('INSERT INTO Producto (idProducto, nombre, descripcion, precio) VALUES (@idProducto, @nombre, @descripcion, @precio)');
}

async function obtenerTodos(){
  const pool = await getPool();
  result = await pool.request()
    .query('SELECT * FROM Producto');
  return result.recordset;
}
module.exports = {crear, obtenerTodos};