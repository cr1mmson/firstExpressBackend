const { getPool, sql } = require('./connection');

// 1. Crea el encabezado y nos devuelve el ID de la factura
async function abrirFactura(nombre, direccion, nit, total, metodoPago) {
    const pool = await getPool();
    
    // Forzamos mayúsculas para asegurar compatibilidad con el CHECK de la base de datos
    const metodoLimpio = (metodoPago || 'EFECTIVO').toUpperCase();

    // Usamos .execute() que es más seguro y mapea automáticamente los parámetros
    const result = await pool.request()
        .input('NombreCliente', sql.NVarChar(150), nombre)
        .input('Direccion', sql.NVarChar(250), direccion)
        .input('NIT', sql.NVarChar(20), nit)
        .input('TotalVenta', sql.Decimal(10, 2), total)
        .input('MetodoPago', sql.NVarChar(30), metodoLimpio)
        .output('idFacturaGenerada', sql.Int) // Declaramos el parámetro de salida del SP
        .execute('dbo.sp_AbrirFactura');
    
    // El valor de salida se captura directamente en result.output
    return result.output.idFacturaGenerada;
}

// 2. Agrega cada producto a la factura (esto ya descuenta el inventario en SQL)
async function agregarDetalle(idFactura, idProducto, cantidad) {
    const pool = await getPool();
    await pool.request()
        .input('idFactura', sql.Int, idFactura)
        .input('idProducto', sql.NVarChar, idProducto)
        .input('Cantidad', sql.Int, cantidad)
        .execute('dbo.sp_AgregarDetalleFactura');
}

// 3. Opcional: Obtener historial de facturas
async function obtenerTodas() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Factura ORDER BY fechaEmision DESC');
    return result.recordset;
}

// 4. Obtener una factura específica con sus productos detallados
async function obtenerPorId(idFactura) {
    const pool = await getPool();
    
    // Traemos el encabezado
    const facturaResult = await pool.request()
        .input('idFactura', sql.Int, idFactura)
        .query('SELECT * FROM Factura WHERE idFactura = @idFactura');

    if (facturaResult.recordset.length === 0) return null;

    // Traemos los detalles cruzando con la tabla Producto para tener los nombres
    const detallesResult = await pool.request()
        .input('idFactura', sql.Int, idFactura)
        .query(`
            SELECT df.idDetalle, df.idProducto, p.nombre, df.cantidad, df.precioUnitario, df.subtotal
            FROM DetalleFactura df
            INNER JOIN Producto p ON df.idProducto = p.idProducto
            WHERE df.idFactura = @idFactura
        `);

    // Juntamos todo en un solo objeto estructurado
    const factura = facturaResult.recordset[0];
    factura.productos = detallesResult.recordset;

    return factura;
}

// 5. Anular factura
async function anularFactura(idFactura) {
    const pool = await getPool();
    await pool.request()
        .input('idFactura', sql.Int, idFactura)
        .execute('dbo.sp_AnularFactura');
}

// Recuerda agregarla al module.exports final:
module.exports = { abrirFactura, agregarDetalle, obtenerTodas, obtenerPorId, anularFactura };

