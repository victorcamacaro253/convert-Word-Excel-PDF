import express from "express";
import multer from "multer";
import path from  "path";
import convertRoutes from './routes/convertRoutes.js'

//Inicializamos  express
const app = express();

//Configurar multer para manejos de archivo 
const upload = multer ({dest:'uploads/'})

//Middleware para servir archivos estaticos (HTML,CSS,JS)

app.use(express.static('public'));

//Ruta de conversion
app.use('/convert',upload.single('file'),convertRoutes);

//Configura el servidor
const PORT = process.env.PORT  || 3008;

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})


