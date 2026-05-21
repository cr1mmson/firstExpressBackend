const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use('/productos',  require('./routes/productos'));
app.use('/lotes', require('./routes/lotes'));
app.use('/facturas', require('./routes/facturas'));

app.listen(3000, () => {
    console.log("PORT 3000");
}).on('error', (err) => {
    console.log("Error al iniciar servidor:", err);
});
