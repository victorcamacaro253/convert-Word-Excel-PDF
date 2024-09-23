import fs from 'fs/promises';
import { default as docxPdf } from 'docx-pdf';
const toPdf = docxPdf.toPdf;

const convertWordToPdf = async (req, res) => {
    try {
        const wordPath = req.file.path;  // Asegúrate de que el archivo Word se suba correctamente

        // Leer el archivo Word y convertirlo a PDF
        const pdfPath = `uploads/${Date.now()}_converted.pdf`;
        await toPdf(wordPath, pdfPath);

        // Descargar el archivo PDF
        res.download(pdfPath, 'converted.pdf', async (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                return res.status(500).send('Error al descargar el archivo.');
            }

            // Eliminar archivos temporales
            try {
                await fs.unlink(wordPath);  // Eliminar el archivo Word original
                await fs.unlink(pdfPath);   // Eliminar el archivo PDF generado
            } catch (deleteError) {
                console.error('Error al eliminar archivos:', deleteError);
            }
        });
    } catch (error) {
        console.error('Error durante la conversión de Word a PDF:', error);
        res.status(500).send('Error durante la conversión de Word a PDF.');
    }
};

export default { convertWordToPdf };
