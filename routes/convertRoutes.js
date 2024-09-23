import { Router } from 'express';
import convertWordToExcel from '../controllers/convertWordToExcel.js';
import convertExcelToWord from '../controllers/convertExcelToWord.js';
import  convertWordToPdf from '../controllers/convertWordToPdf.js';
import convertPdfToWord from '../controllers/convertPdfToWord.js';

const router = Router()

//Ruta para convertir un archivo Excel a Word
router.post('/excelToWord',convertExcelToWord.convertExcelToWord);

//Ruta para convertir un archivo Word a Excel
router.post('/WordToExcel',convertWordToExcel.convertWordToExcel);

//Router para convertir un archivo Word a PDF
router.post('/WordToPdf',convertWordToPdf.convertWordToPdf);

//Ruta para convertir un archivo PDF a Word
router.post('/PdfToWord',convertPdfToWord.convertPdfToWord);


export  default router;

