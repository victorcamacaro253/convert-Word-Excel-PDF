import XLSX from 'xlsx';
import fs from 'fs/promises';
import path from 'path';
import { Document, Packer, Paragraph } from 'docx';
import mammoth from 'mammoth'; // Asegúrate de instalar mammoth para leer archivos Word

const convertWordToExcel = async (req, res) => {
    try {
        const wordPath = req.file.path;

        // Leer el contenido del archivo Word
        const { value: text } = await mammoth.extractRawText({ path: wordPath });
        const paragraphs = text.split('\n').filter(line => line.trim() !== '');

        // Convertir los párrafos en un arreglo
        const data = paragraphs.map(paragraph => [paragraph]); // Cada párrafo en una fila

        // Crear un nuevo libro de Excel
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Guardar el archivo Excel
        const excelPath = `uploads/${Date.now()}_converted.xlsx`;
        await XLSX.writeFile(workbook, excelPath);

        // Descargar el archivo Excel
        res.download(excelPath, 'converted.xlsx', async (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                return res.status(500).send('Error al descargar el archivo.');
            }

            // Eliminar archivos temporales
            try {
                await fs.unlink(wordPath);  // Eliminar archivo Word original
                await fs.unlink(excelPath); // Eliminar archivo Excel generado
            } catch (deleteError) {
                console.error('Error al eliminar archivos:', deleteError);
            }
        });
    } catch (error) {
        console.error('Error durante la conversión de Word a Excel:', error);
        res.status(500).send('Error durante la conversión de Word a Excel.');
    }
};

export default { convertWordToExcel };
