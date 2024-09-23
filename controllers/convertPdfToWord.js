import fs from 'fs/promises';
import pdf from 'pdf-parse';
import { Document, Packer, Paragraph } from 'docx';

const convertPdfToWord = async (req, res) => {
  try {
    const pdfPath = req.file.path;

    // Leer el archivo PDF
    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfData = await pdf(pdfBuffer);

    // Extraer el texto de todas las páginas del PDF
    const extractedText = pdfData.text;

    // Crear un nuevo documento Word usando `docx`
    const doc = new Document();

    // Dividir el texto extraído en líneas y agregarlo como párrafos en el documento Word
    extractedText.split('\n').forEach(line => {
      doc.addSection({
        children: [new Paragraph(line)],
      });
    });

    // Generar el archivo Word
    const wordBuffer = await Packer.toBuffer(doc);

    const wordPath = `uploads/${Date.now()}_converted.docx`;
    await fs.writeFile(wordPath, wordBuffer);

    // Descargar el archivo Word
    res.download(wordPath, 'converted.docx', async (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        return res.status(500).send('Error al descargar el archivo.');
      }

      // Eliminar archivos temporales
      try {
        await fs.unlink(pdfPath);  // Eliminar archivo PDF original
        await fs.unlink(wordPath); // Eliminar archivo Word generado
      } catch (deleteError) {
        console.error('Error al eliminar archivos:', deleteError);
      }
    });
  } catch (error) {
    console.error('Error durante la conversión de PDF a Word:', error);
    res.status(500).send('Error durante la conversión de PDF a Word.');
  }
};

export default { convertPdfToWord };