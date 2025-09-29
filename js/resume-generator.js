/**
 * Resume Generator - Main Application Logic
 * Handles template loading, rendering, and PDF generation
 */

class ResumeGenerator {
  constructor() {
    this.templates = {};
    this.currentTemplate = 'template1';
    this.resumeData = null;
  }

  /**
   * Initialize the generator by loading templates
   */
  async init() {
    await this.loadTemplates();
  }

  /**
   * Load all templates from the templates directory
   */
  async loadTemplates() {
    try {
      const template1 = await fetch('templates/template1.html');
      const template2 = await fetch('templates/template2.html');

      this.templates.template1 = await template1.text();
      this.templates.template2 = await template2.text();

      console.log('Templates loaded successfully');
    } catch (error) {
      console.error('Error loading templates:', error);
      throw error;
    }
  }

  /**
   * Set the resume data from JSON
   * @param {object|string} data - Resume data object or JSON string
   */
  setResumeData(data) {
    if (typeof data === 'string') {
      this.resumeData = JSON.parse(data);
    } else {
      this.resumeData = data;
    }
  }

  /**
   * Set the current template
   * @param {string} templateName - Name of the template to use
   */
  setTemplate(templateName) {
    if (this.templates[templateName]) {
      this.currentTemplate = templateName;
    } else {
      console.error(`Template ${templateName} not found`);
    }
  }

  /**
   * Generate HTML from current template and data
   * @returns {string} Rendered HTML
   */
  generateHTML() {
    if (!this.resumeData) {
      throw new Error('Resume data not set. Call setResumeData() first.');
    }

    const template = this.templates[this.currentTemplate];
    return TemplateRenderer.render(template, this.resumeData);
  }

  /**
   * Preview the resume in the specified element
   * @param {string|HTMLElement} target - Target element or selector
   */
  preview(target) {
    const html = this.generateHTML();
    const element = typeof target === 'string' ? document.querySelector(target) : target;

    if (element) {
      element.innerHTML = html;
    } else {
      console.error('Preview target not found');
    }
  }

  /**
   * Generate and download PDF using html2pdf
   * @param {string} filename - Name for the PDF file
   */
  async generatePDF(filename = 'resume.pdf') {
    const html = this.generateHTML();

    // Create a temporary container with proper styling
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '-9999px';
    container.style.width = '210mm'; // A4 width
    container.style.backgroundColor = 'white';
    document.body.appendChild(container);

    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Find the resume container within
      const resumeElement = container.querySelector('.resume-container');

      if (!resumeElement) {
        throw new Error('Resume container not found');
      }

      // Adjust styles for PDF generation
      resumeElement.style.boxShadow = 'none';
      resumeElement.style.borderRadius = '0';
      resumeElement.style.maxWidth = 'none';
      resumeElement.style.margin = '0';

      // Prevent page breaks inside all children
      resumeElement.style.breakInside = 'avoid';
      resumeElement.style.pageBreakInside = 'avoid';
      Array.from(resumeElement.querySelectorAll('*')).forEach(el => {
        el.style.breakInside = 'avoid';
        el.style.pageBreakInside = 'avoid';
      });

      // Convert px to mm helper (96 px ≈ 25.4 mm)
      const pxToMm = (px) => px * 0.264583;

      // Measure the fully rendered height of the resume content
      const contentWidthPx = resumeElement.scrollWidth;
      const contentHeightPx = resumeElement.scrollHeight;
      const pageWidthMm = 210; // A4 width in mm
      const contentHeightMm = Math.max(pxToMm(contentHeightPx), 1);

      const opt = {
        margin: [5, 5, 5, 5],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          windowWidth: contentWidthPx
        },
        jsPDF: {
          unit: 'mm',
          // Use a single custom-sized page: A4 width, dynamic height
          format: [pageWidthMm, contentHeightMm + 10],
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      console.log('Generating PDF...');
      await html2pdf().set(opt).from(resumeElement).save();
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      // Wait a bit before removing to ensure PDF is saved
      await new Promise(resolve => setTimeout(resolve, 300));
      document.body.removeChild(container);
    }
  }

  /**
   * Get the current template name
   * @returns {string}
   */
  getCurrentTemplate() {
    return this.currentTemplate;
  }

  /**
   * Get list of available templates
   * @returns {string[]}
   */
  getAvailableTemplates() {
    return Object.keys(this.templates);
  }

  /**
   * Alternative method: Open print dialog for manual PDF generation
   * Use this as fallback if generatePDF() fails
   */
  printResume() {
    const html = this.generateHTML();

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = function () {
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    }
  }
}

// Export for use in other modules or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResumeGenerator;
}
