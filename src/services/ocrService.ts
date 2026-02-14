import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imageFile: File | string): Promise<string> => {
    try {
        const { data: { text } } = await Tesseract.recognize(
            imageFile,
            'eng+hin', // Support both English and Hindi for OCR
            {
                logger: m => console.log(m)
            }
        );
        return text.trim();
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Failed to extract text from image.');
    }
};
