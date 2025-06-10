const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Function to generate PDF
exports.generatePDF = (req, res) => {
    console.log("Received request to generate PDF");

    const { data } = req.body; // Expecting data in the request body

    if (!data) {
        console.log("No data provided");
        return res.status(400).json({ message: 'No data provided' });
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Ensure 'uploads' directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Path to store the PDF
    const pdfPath = path.join(uploadsDir, `generatedFile_${Date.now()}.pdf`);

    // Write the PDF to a file
    const writeStream = fs.createWriteStream(pdfPath);

    writeStream.on('finish', () => {
        console.log("PDF generation complete");
        res.status(200).json({
            message: 'PDF generated successfully',
            pdfUrl: `/uploads/${path.basename(pdfPath)}` // URL for client
        });
    });

    writeStream.on('error', (err) => {
        console.error("Error writing PDF:", err);
        res.status(500).json({ message: 'Error generating PDF', error: err });
    });

    // Pipe the PDF document to the write stream
    doc.pipe(writeStream);

    // Add content to the PDF
    doc.fontSize(25).text('Generated PDF Document', { align: 'center' });
    doc.fontSize(12).text(`Data: ${data}`, { align: 'left', continued: true });

    // Finalize the PDF
    doc.end();

    console.log("Finalizing PDF document");
};