import XLSX from 'xlsx';
import { Document, Packer, Paragraph } from 'docx';
import fs from 'fs/promises';

const convertExcelToWord = async (req, res) => {
    try {
        const excelPath = req.file.path;

        // Leer el archivo Excel
        const workbook = XLSX.readFile(excelPath);
        const sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheet_name];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Crear el documento Word
        const doc = new Document({
            sections: [{
                properties: {},
                children: data.map(row => new Paragraph(row.join(' '))),
            }],
        });

        // Guardar el archivo Word
        const wordPath = `uploads/${Date.now()}_converted.docx`;
        const buffer = await Packer.toBuffer(doc); // Convertir el documento en un buffer
        await fs.writeFile(wordPath, buffer);      // Guardar el archivo

        // Descargar el archivo Word
        res.download(wordPath, 'converted.docx', async (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                return res.status(500).send('Error al descargar el archivo.');
            }

            // Eliminar archivos temporales
            try {
                await fs.unlink(excelPath);  // Eliminar archivo Excel original
                await fs.unlink(wordPath);   // Eliminar archivo Word generado
            } catch (deleteError) {
                console.error('Error al eliminar archivos:', deleteError);
            }
        });
    } catch (error) {
        console.error('Error durante la conversión de Excel a Word:', error);
        res.status(500).send('Error durante la conversión de Excel a Word.');
    }
};

export default { convertExcelToWord };

