const router = require('express').Router();
const facturacionService = require('../services/FacturacionService');

// POST: Crear una factura con múltiples productos
router.post('/', async (req, res) => {
    try {
        // 1. CAPTURA INTELIGENTE Y CONVERSIÓN A MAYÚSCULAS
        const valorJson = req.body.metodoPago !== undefined ? req.body.metodoPago : req.body.MetodoPago;
        let metodoPagoFinal = (valorJson && valorJson.trim() !== '') ? valorJson.trim().toUpperCase() : 'EFECTIVO';

        // 2. HOMOLOGACIÓN: Si mandan "TARJETA", lo convertimos al formato exacto del CHECK
        if (metodoPagoFinal === 'TARJETA' || metodoPagoFinal.includes('CREDITO') || metodoPagoFinal.includes('DEBITO')) {
            metodoPagoFinal = 'TARJETA CREDITO/DEBITO';
        }

        const { nombre, direccion, nit, total, productos } = req.body;

        // Validación rápida de productos
        if (!nombre || !productos || productos.length === 0) {
            return res.status(400).json({ error: 'Datos insuficientes para facturar' });
        }

        // 3. Enviamos el método de pago ya verificado al servicio
        const resultado = await facturacionService.procesarVentaCompleta({
            nombre,
            direccion,
            nit,
            total,
            productos,
            metodoPago: metodoPagoFinal 
        });

        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET: Ver historial de facturas
router.get('/', async (req, res) => {
    try {
        const historial = await facturacionService.obtenerHistorial();
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el historial' });
    }
});

// GET: Ver una factura específica por su ID (ejemplo: /facturas/9)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const facturaCompleta = await facturacionService.obtenerDetalleFactura(id);
        res.json(facturaCompleta);
    } catch (error) {
        if (error.message === 'La factura solicitada no existe') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error al obtener el detalle de la factura' });
    }
});


// POST: Anular una factura pasando el ID en el cuerpo JSON
router.post('/anular', async (req, res) => {
    try {
        const { idFactura } = req.body; // Extrae el ID desde el JSON

        if (!idFactura) {
            return res.status(400).json({ error: 'El idFactura es obligatorio' });
        }

        const resultado = await facturacionService.anularVenta(idFactura);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;