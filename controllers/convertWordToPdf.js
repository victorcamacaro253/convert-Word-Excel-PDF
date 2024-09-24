import fs from 'fs/promises'
import docxPdf from 'docx-pdf'
const convertWordToPdf = async (req, res) => {
    try {
        const wordPath = req.file.path;
        const pdfPath = `uploads/${Date.now()}_converted.pdf`;

        // Convert Word to PDF using docx-pdf
        await new Promise((resolve, reject) => {
            docxPdf(wordPath, pdfPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        // Verify if the PDF file was generated
        console.log('Archivo PDF generado en:', pdfPath);
        const pdfExists = await fs.access(pdfPath).then(() => true).catch(() => false);
        if (!pdfExists) {
            throw new Error('El archivo PDF no se generó correctamente');
        }

        // Download the PDF file
        res.download(pdfPath, 'converted.pdf', async (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                return res.status(500).send('Error al descargar el archivo.');
            }

            // Delete temporary files
            try {
                await fs.unlink(wordPath);
                await fs.unlink(pdfPath);
            } catch (deleteError) {
                console.error('Error al eliminar archivos:', deleteError);
            }
        });
    } catch (error) {
        console.error('Error durante la conversión de Word a PDF:', error);
        res.status(500).send('Error durante la conversión de Word a PDF.');
    }
};

export default {convertWordToPdf}