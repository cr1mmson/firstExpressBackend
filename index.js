const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use('/productos',  require('./routes/productos'));
app.use('/lotes', require('./routes/lotes'));

app.listen(3000);
