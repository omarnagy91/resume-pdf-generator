/**
 * INTEGRATION EXAMPLES
 * Copy these examples for quick integration into your projects
 */

// ============================================
// EXAMPLE 1: Basic Usage
// ============================================
async function basicUsage() {
  // Initialize generator
  const generator = new ResumeGenerator();
  await generator.init();

  // Your resume data
  const resumeData = {
    personalInfo: {
      name: "John Doe",
      title: "Software Developer",
      email: "john@example.com",
      phone: "+1 234 567 8900",
      location: "New York, NY",
      website: "johndoe.dev",
      initials: "JD"
    },
    summary: "Experienced developer with 5 years in web development...",
    experience: [
      {
        title: "Senior Developer",
        company: "Tech Corp",
        date: "2020 - Present",
        description: "Leading development team..."
      }
    ],
    // ... rest of your data
  };

  // Set data and generate
  generator.setResumeData(resumeData);
  generator.preview('#resume-preview');
  await generator.generatePDF('john-doe-resume.pdf');
}

// ============================================
// EXAMPLE 2: Chrome Extension Integration
// ============================================

// In your popup.js or content script:
class ResumeExtension {
  constructor() {
    this.generator = null;
  }

  async init() {
    this.generator = new ResumeGenerator();
    await this.generator.init();
  }

  async generateFromStorage() {
    // Get data from Chrome storage
    const data = await new Promise((resolve) => {
      chrome.storage.local.get(['resumeData'], (result) => {
        resolve(result.resumeData);
      });
    });

    if (data) {
      this.generator.setResumeData(data);
      await this.generator.generatePDF('resume.pdf');
    }
  }

  async saveData(resumeData) {
    // Save to Chrome storage
    await new Promise((resolve) => {
      chrome.storage.local.set({ resumeData }, resolve);
    });
  }
}

// Usage:
const extension = new ResumeExtension();
await extension.init();
await extension.generateFromStorage();

// ============================================
// EXAMPLE 3: React Component Integration
// ============================================

// ResumeGenerator.jsx
import { useEffect, useState } from 'react';

function ResumeGeneratorComponent() {
  const [generator, setGenerator] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    // Initialize generator
    const initGenerator = async () => {
      const gen = new ResumeGenerator();
      await gen.init();
      setGenerator(gen);
    };
    initGenerator();
  }, []);

  const handleGenerate = async () => {
    if (generator && resumeData) {
      generator.setResumeData(resumeData);
      await generator.generatePDF('resume.pdf');
    }
  };

  const handlePreview = () => {
    if (generator && resumeData) {
      generator.setResumeData(resumeData);
      generator.preview('#preview-container');
    }
  };

  return (
    <div>
      <button onClick={handlePreview}>Preview</button>
      <button onClick={handleGenerate}>Download PDF</button>
      <div id="preview-container"></div>
    </div>
  );
}

// ============================================
// EXAMPLE 4: Node.js Backend Integration
// ============================================

// Using with Express.js
const express = require('express');
const app = express();

app.post('/generate-resume', async (req, res) => {
  const resumeData = req.body;

  // You would need to use a server-side PDF library like puppeteer
  const puppeteer = require('puppeteer');
  const generator = new ResumeGenerator();
  await generator.init();

  generator.setResumeData(resumeData);
  const html = generator.generateHTML();

  // Generate PDF with puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();

  res.contentType('application/pdf');
  res.send(pdf);
});

// ============================================
// EXAMPLE 5: Dynamic Template Switching
// ============================================

async function multiTemplateGenerator(resumeData, templateChoice) {
  const generator = new ResumeGenerator();
  await generator.init();
  
  generator.setResumeData(resumeData);
  
  // Switch templates based on user preference
  generator.setTemplate(templateChoice); // 'template1' or 'template2'
  
  // Preview in different containers for comparison
  generator.preview('#preview-1');
  
  generator.setTemplate('template2');
  generator.preview('#preview-2');
  
  // User selects preferred template
  generator.setTemplate(templateChoice);
  await generator.generatePDF('resume.pdf');
}

// ============================================
// EXAMPLE 6: Batch PDF Generation
// ============================================

async function batchGenerate(resumeDataArray) {
  const generator = new ResumeGenerator();
  await generator.init();

  for (const data of resumeDataArray) {
    generator.setResumeData(data);
    const filename = `${data.personalInfo.name.replace(/\s+/g, '-')}-resume.pdf`;
    await generator.generatePDF(filename);
    
    // Add delay to prevent overwhelming the browser
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Usage:
const resumes = [
  { personalInfo: { name: "John Doe", ... }, ... },
  { personalInfo: { name: "Jane Smith", ... }, ... },
];
await batchGenerate(resumes);

// ============================================
// EXAMPLE 7: Loading Data from API
// ============================================

async function generateFromAPI(userId) {
  // Fetch data from your API
  const response = await fetch(`/api/users/${userId}/resume`);
  const resumeData = await response.json();

  // Generate resume
  const generator = new ResumeGenerator();
  await generator.init();
  generator.setResumeData(resumeData);
  await generator.generatePDF(`resume-${userId}.pdf`);
}

// ============================================
// EXAMPLE 8: Custom Template Loading
// ============================================

async function loadCustomTemplate() {
  const generator = new ResumeGenerator();
  await generator.init();

  // Load a custom template
  const customTemplate = await fetch('/path/to/custom-template.html');
  const templateHtml = await customTemplate.text();
  
  // Add to generator (you may need to extend the class)
  generator.templates['custom'] = templateHtml;
  generator.setTemplate('custom');
  
  // Generate with custom template
  generator.setResumeData(yourData);
  await generator.generatePDF('custom-resume.pdf');
}

// ============================================
// EXAMPLE 9: Validation Before Generation
// ============================================

function validateResumeData(data) {
  const required = ['personalInfo', 'summary', 'experience'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  if (!data.personalInfo.name || !data.personalInfo.email) {
    throw new Error('Name and email are required in personalInfo');
  }
  
  return true;
}

async function safeGenerate(resumeData) {
  try {
    validateResumeData(resumeData);
    
    const generator = new ResumeGenerator();
    await generator.init();
    generator.setResumeData(resumeData);
    await generator.generatePDF('resume.pdf');
    
    return { success: true };
  } catch (error) {
    console.error('Generation failed:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// EXAMPLE 10: Real-time Preview Updates
// ============================================

class LiveResumeEditor {
  constructor() {
    this.generator = null;
    this.debounceTimer = null;
  }

  async init() {
    this.generator = new ResumeGenerator();
    await this.generator.init();
  }

  updateData(field, value) {
    // Update specific field in resume data
    // ... your update logic
    
    // Debounce preview updates
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.updatePreview();
    }, 500);
  }

  updatePreview() {
    if (this.generator) {
      this.generator.preview('#live-preview');
    }
  }

  async download() {
    await this.generator.generatePDF('resume.pdf');
  }
}

// Usage:
const editor = new LiveResumeEditor();
await editor.init();

// Connect to form inputs
document.getElementById('name-input').addEventListener('input', (e) => {
  editor.updateData('personalInfo.name', e.target.value);
});
