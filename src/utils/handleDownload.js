import jsPDF from "jspdf";

const handleDownload = (text) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth(); // Get the width of the PDF page
  const pageHeight = doc.internal.pageSize.getHeight(); // Get the height of the PDF page
  const margin = 10; // Define a margin
  const maxLineWidth = pageWidth - margin * 2; // Maximum width of the text inside the page

  let yPosition = margin; // Start printing text at this Y position

  // Split the text into lines that fit within the page width
  const wrappedText = doc.splitTextToSize(text, maxLineWidth);

  wrappedText.forEach((textLine) => {
    doc.text(textLine, margin, yPosition); // Add the text line to the PDF
    yPosition += 10; // Move down for the next line

    // Check if the Y position goes beyond the page height
    if (yPosition > pageHeight - margin) {
      doc.addPage(); // Add a new page when the text exceeds the page height
      yPosition = margin; // Reset Y position for the new page
    }
  });

  // Save the created PDF
  doc.save("packGpt.pdf");
};

export default handleDownload;
