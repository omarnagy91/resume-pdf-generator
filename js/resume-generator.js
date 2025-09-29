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
    
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    try {
      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      await html2pdf().set(opt).from(container).save();
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
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
}

// Export for use in other modules or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResumeGenerator;
}
