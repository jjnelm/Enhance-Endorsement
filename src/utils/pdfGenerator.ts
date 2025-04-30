import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { FormData } from "../types";

export const generatePDF = async (formData: FormData): Promise<void> => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]); // Adjusted size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Colors
    const black = rgb(0, 0, 0);
    const grey = rgb(0.4, 0.4, 0.4);

    // Load background image (stored locally in /public folder)
    try {
      const imageResponse = await fetch('/Qmbg2.jpg');
      if (!imageResponse.ok) {
        throw new Error(`Failed to load image: ${imageResponse.statusText}`);
      }
      
      const contentType = imageResponse.headers.get('content-type');
      const imageBytes = await imageResponse.arrayBuffer();
      
      let img;
      if (contentType?.includes('png')) {
        img = await pdfDoc.embedPng(imageBytes);
      } else {
        img = await pdfDoc.embedJpg(imageBytes);
      }

      // Draw background image (full-page size)
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
    } catch (error) {
      console.warn('Background image could not be loaded:', error);
      // Continue without the background image
    }

    // Section Titles
    page.drawText("RECIPIENT INFORMATION", { x: 160, y: height - 180, size: 24, font, color: black });
    page.drawText("SENDER INFORMATION", { x: 180, y: height - 430, size: 24, font, color: black });
    page.drawText("NOTES (if any)", { x: 210, y: height - 580, size: 28, font, color: black });

    // Table settings
    const startX = 50;
    const startY = height - 220;
    const rowHeight = 25;
    const col1Width = 250;
    const col2Width = 250;

    // Draw recipient fields with borders
    const labels = [
      "DESTINATION BANK NAME",
      "DESTINATION ACCOUNT NUMBER",
      "AMOUNT",
      "TRACE NUMBER",
      "RECIPIENT'S FIRST NAME",
      "RECIPIENT'S LAST NAME",
      "RECIPIENT'S EMAIL ADDRESS",
    ];

    const dataKeys = [
      "bankName",
      "accountNumber",
      "amount",
      "traceNumber",
      "firstName",
      "lastName",
      "email"
    ];

    labels.forEach((label, i) => {
      const yPos = startY - i * rowHeight;
      
      // Draw field label column
      page.drawRectangle({ x: startX, y: yPos, width: col1Width, height: rowHeight, borderColor: black, borderWidth: 1 });
      page.drawText(label, { x: startX + 10, y: yPos + 7, size: 12, font, color: black });

      // Draw answer column
      page.drawRectangle({ x: startX + col1Width, y: yPos, width: col2Width, height: rowHeight, borderColor: black, borderWidth: 1 });
      
      const dataKey = dataKeys[i] as keyof FormData;
      page.drawText(formData[dataKey] || '', { x: startX + col1Width + 10, y: yPos + 7, size: 14, font: regularFont, color: grey });
    });

    // Sender Information (Pre-filled)
    const senderLabels = ["SENDER'S FIRST NAME", "SENDER'S LAST NAME", "SENDER'S EMAIL ADDRESS"];
    const senderValues = ["Quantum Metal Digital Solutions Inc.", "QMDSI", "info@qmdsi.com"];

    senderLabels.forEach((label, i) => {
      const yPos = height - 470 - i * rowHeight;
      
      // Draw sender label column
      page.drawRectangle({ x: startX, y: yPos, width: col1Width, height: rowHeight, borderColor: black, borderWidth: 1 });
      page.drawText(label, { x: startX + 10, y: yPos + 7, size: 12, font, color: black });

      // Draw sender value column
      page.drawRectangle({ x: startX + col1Width, y: yPos, width: col2Width, height: rowHeight, borderColor: black, borderWidth: 1 });
      page.drawText(senderValues[i], { x: startX + col1Width + 10, y: yPos + 7, size: 12, font, regularFont, color: black });
    });

    // Notes Section (Multiline)
    const notesY = height - 690;
    page.drawRectangle({ x: startX, y: notesY, width: col1Width + col2Width, height: 100, borderColor: black, borderWidth: 1 });
    
    // Split notes into multiple lines if needed
    const notesText = formData.notes || '';
    const notesWords = notesText.split(' ');
    let currentLine = '';
    let lineY = notesY + 80;
    const lineHeight = 15;
    const maxWidth = col1Width + col2Width - 20;
    
    for (const word of notesWords) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = regularFont.widthOfTextAtSize(testLine, 12);
      
      if (textWidth > maxWidth) {
        page.drawText(currentLine, { x: startX + 10, y: lineY, size: 12, font: regularFont, color: black });
        currentLine = word;
        lineY -= lineHeight;
        
        // Stop if we run out of space
        if (lineY < notesY + 10) break;
      } else {
        currentLine = testLine;
      }
    }
    
    // Draw the last line if there's any text left
    if (currentLine) {
      page.drawText(currentLine, { x: startX + 10, y: lineY, size: 12, font: regularFont, color: black });
    }

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    const recipientLastName = formData.lastName || "Unknown";
    const recipientFirstName = formData.firstName || "Unknown";
    const traceNumber = formData.traceNumber || "Unknown";
    const fileName = `${recipientLastName}, ${recipientFirstName}_${traceNumber}.pdf`;

    // Save the PDF with the generated filename
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), fileName);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error generating PDF:', error);
    return Promise.reject(error);
  }
};