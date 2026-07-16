import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface PdfExportOptions {
  filename?: string;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * Reusable utility to export an HTML Element to a PDF file using html2canvas and jsPDF.
 * Optimized for A4 printing/rendering of business documents.
 *
 * @param element The target HTMLElement to render to PDF
 * @param options Export options including filename and status callbacks
 */
export async function exportToPdf(
  element: HTMLElement,
  options: PdfExportOptions = {}
): Promise<void> {
  const {
    filename = "document.pdf",
    onStart,
    onComplete,
    onError,
  } = options;

  if (onStart) onStart();

  try {
    // html2canvas configurations for optimal high-fidelity capture
    const canvas = await html2canvas(element, {
      scale: 2, // Double resolution for ultra-sharp text and crisp logo images
      useCORS: true, // Enable cross-origin resource sharing for base64 & external images
      allowTaint: true,
      backgroundColor: "#ffffff", // Force a solid white background
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    // Initialize A4 Portrait PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    // Element's aspect ratio calculation
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pdfHeight;

    // Multi-page handling: if image height exceeds one A4 page, create next pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; // slide up the image mapping
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);

    if (onComplete) onComplete();
  } catch (error) {
    console.error("PDF Export failed:", error);
    if (onError) {
      onError(error);
    } else {
      alert("Failed to export PDF. Please check document contents and try again.");
    }
  }
}
