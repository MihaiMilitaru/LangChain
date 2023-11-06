import * as pdfjs from 'pdfjs-dist';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '../types/Types';

pdfjs.GlobalWorkerOptions.workerSrc =
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.3.122/build/pdf.worker.min.js';

function formatSize(size: number) {
  let sizeCopy = size;
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  while (sizeCopy >= 1024 && unitIndex < units.length - 1) {
    sizeCopy /= 1024;
    unitIndex += 1;
  }
  return `${sizeCopy.toFixed(2)} ${units[unitIndex]}`;
}

type FileContentType = string | ArrayBuffer | null;

export default async function readDoc(
  file: File,
  fileContent: FileContentType,
  fileType: string
) {
  if (fileType === 'application/pdf') {
    try {
      const pdf = await pdfjs.getDocument({ data: fileContent || undefined })
        .promise;
      let text = '';
      const arr = Array.from({ length: pdf.numPages }, (_, i) => i + 1);

      for await (const page of arr.map((x) => pdf.getPage(x))) {
        const pageText = await page.getTextContent();
        text += pageText.items
          .map((x) => {
            if ('str' in x) return x.str;
            return '';
          })
          .join(' ');
      }

      const uuid = uuidv4();
      const currentDate = new Date().toLocaleDateString();

      const document: Document = {
        id: uuid,
        name: file.name,
        content: text,
        type: fileType,
        size: formatSize(file.size),
        uploadDate: currentDate,
        chapters: [],
      };
      return document;
    } catch (err) {
      return 'error';
    }
  } else if (fileType === 'text/plain') {
    try {
      const text = await new Response(fileContent).text();

      const uuid = uuidv4();
      const currentDate = new Date().toLocaleDateString();

      const document: Document = {
        id: uuid,
        name: file.name,
        content: text,
        type: fileType,
        size: formatSize(file.size),
        uploadDate: currentDate,
        chapters: [],
      };
      return document;
    } catch (err) {
      return 'error';
    }
  } else {
    return 'error';
  }
}
