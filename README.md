# Resume Generator

A lightweight, browser-based resume generator that creates beautiful PDF resumes from JSON data. Choose from multiple templates and generate professional resumes instantly.

## Features

- 📄 **Multiple Templates**: Choose from two professional resume designs
- 🎨 **PDF Generation**: Export your resume as a high-quality PDF
- 📝 **JSON-Based**: Easy to use with any data source
- 🚀 **Lightweight**: No backend required, runs entirely in the browser
- 🔌 **Easy Integration**: Can be integrated into Chrome extensions or other projects
- 📱 **Responsive**: Templates are mobile-friendly and print-optimized

## Quick Start

1. Open `index.html` in your web browser
2. Click "Load Sample Data" to see an example
3. Click "Apply Data" to load the data into the generator
4. Click "Preview Resume" to see your resume
5. Click "Download PDF" to save your resume

### ⚠️ Important: Printing with Backgrounds

When using the **Print Resume** button, you must enable background graphics in your print dialog:

- **Chrome/Edge:** More settings → Check "Background graphics"
- **Firefox:** Check "Print backgrounds (colors & images)"
- **Safari:** Check "Print backgrounds"

The templates include CSS to force background printing, but some browsers still require manual settings adjustment.

## Using Your Own Data

### Option 1: Upload JSON File
1. Click "Upload JSON File" button
2. Select your JSON file
3. Click "Apply Data"

### Option 2: Paste JSON
1. Paste your JSON data into the text area
2. Click "Apply Data"

## JSON Data Structure

Here's the complete data structure you can use:

```json
{
  "personalInfo": {
    "name": "Your Name",
    "title": "Your Job Title",
    "email": "email@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "City, State",
    "website": "yourwebsite.com",
    "initials": "YN"
  },
  "professionalLinks": [
    { "icon": "💼", "label": "LinkedIn", "url": "linkedin.com/in/yourprofile" },
    { "icon": "⚡", "label": "GitHub", "url": "github.com/yourprofile" }
  ],
  "summary": "Your professional summary...",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "date": "Jan 2020 - Present",
      "description": "What you did at this job..."
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "tech": ["React", "Node.js"],
      "date": "2023 - Present",
      "description": "Project description...",
      "links": [
        { "label": "GitHub", "url": "#", "icon": "📁" }
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "school": "University Name",
      "date": "2014 - 2018",
      "description": "Additional details..."
    }
  ],
  "skills": {
    "grouped": [
      {
        "category": "Frontend",
        "items": ["JavaScript", "React"]
      }
    ],
    "flat": ["JavaScript", "Python", "Docker"]
  },
  "languages": [
    { "name": "English", "level": "Native" }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "year": "2023"
    }
  ],
  "achievements": [
    {
      "title": "Achievement Title",
      "description": "What you achieved..."
    }
  ],
  "volunteer": [
    {
      "role": "Volunteer Role",
      "organization": "Organization Name",
      "date": "2021 - Present",
      "description": "What you did..."
    }
  ]
}
```

## Available Templates

### Template 1: Two-Column Layout
- Classic two-column design
- Main content on the left, supporting info on the right
- Best for comprehensive resumes with lots of detail

### Template 2: Sidebar Layout
- Modern sidebar design with dark left panel
- Skills grouped by category
- Best for technical resumes or portfolios

## Integration Guide

### Using in a Chrome Extension

1. Copy the core files to your extension:
   - `js/template-renderer.js`
   - `js/resume-generator.js`
   - `templates/template1.html`
   - `templates/template2.html`

2. Include in your manifest.json:
```json
{
  "content_scripts": [{
    "js": [
      "js/template-renderer.js",
      "js/resume-generator.js"
    ]
  }]
}
```

3. Use in your extension code:
```javascript
// Initialize
const generator = new ResumeGenerator();
await generator.init();

// Set data
generator.setResumeData(yourResumeData);

// Generate HTML
const html = generator.generateHTML();

// Generate PDF
await generator.generatePDF('resume.pdf');
```

### Using in a Web App

Simply include the scripts in your HTML:

```html
<!-- Include html2pdf library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

<!-- Include resume generator -->
<script src="js/template-renderer.js"></script>
<script src="js/resume-generator.js"></script>

<script>
  const generator = new ResumeGenerator();
  await generator.init();
  generator.setResumeData(data);
  generator.preview('#preview-element');
</script>
```

### Using as a Module

If you're using a bundler like webpack:

```javascript
import ResumeGenerator from './js/resume-generator.js';
import TemplateRenderer from './js/template-renderer.js';

const generator = new ResumeGenerator();
await generator.init();
```

## API Reference

### ResumeGenerator Class

#### Methods

**`init()`**
- Initializes the generator and loads templates
- Returns: `Promise<void>`
- Must be called before using other methods

**`setResumeData(data)`**
- Sets the resume data
- Parameters:
  - `data`: Object or JSON string containing resume data
- Returns: `void`

**`setTemplate(templateName)`**
- Changes the current template
- Parameters:
  - `templateName`: String ('template1' or 'template2')
- Returns: `void`

**`generateHTML()`**
- Generates HTML from current template and data
- Returns: `string` (rendered HTML)

**`preview(target)`**
- Renders the resume in a DOM element
- Parameters:
  - `target`: String (CSS selector) or HTMLElement
- Returns: `void`

**`generatePDF(filename)`**
- Generates and downloads a PDF
- Parameters:
  - `filename`: String (default: 'resume.pdf')
- Returns: `Promise<void>`

**`getCurrentTemplate()`**
- Gets the current template name
- Returns: `string`

**`getAvailableTemplates()`**
- Gets list of available templates
- Returns: `string[]`

### TemplateRenderer Class

#### Static Methods

**`render(templateHtml, data)`**
- Renders a template with data
- Parameters:
  - `templateHtml`: String (template HTML)
  - `data`: Object (resume data)
- Returns: `string` (rendered HTML)

## Customization

### Adding a New Template

1. Create a new HTML file in `templates/` directory (e.g., `template3.html`)
2. Use placeholders like `{{name}}`, `{{experience}}`, etc.
3. Update `resume-generator.js` to load your template:

```javascript
async loadTemplates() {
  // ... existing code
  const template3 = await fetch('templates/template3.html');
  this.templates.template3 = await template3.text();
}
```

4. Add option to the template selector in `index.html`

### Customizing Existing Templates

Simply edit the HTML and CSS in the template files. The placeholder syntax is:
- `{{fieldName}}` - For simple text replacement
- `{{sectionName}}` - For repeating sections (handled by TemplateRenderer)

## File Structure

```
resume-generator/
├── index.html              # Main application interface
├── sample-data.json        # Example resume data
├── README.md              # This file
├── js/
│   ├── resume-generator.js    # Main generator logic
│   └── template-renderer.js   # Template rendering engine
└── templates/
    ├── template1.html         # Two-column template
    └── template2.html         # Sidebar template
```

## Dependencies

- **html2pdf.js** (v0.10.1) - For PDF generation
  - Loaded from CDN: `https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js`
  - No installation required

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

## Tips for Best Results

1. **Keep descriptions concise**: Aim for 2-3 lines per job/project
2. **Use consistent formatting**: Follow the sample data structure
3. **Test both templates**: See which one works best for your content
4. **Preview before downloading**: Always check the preview first
5. **Use high-quality data**: The better your input, the better your resume

## Troubleshooting

**PDF not generating?**
- Make sure you're running the app through a web server (not file://)
- Check browser console for errors
- Ensure all scripts are loaded

**Templates not loading?**
- Verify templates directory is in the same folder as index.html
- Check browser console for 404 errors
- Make sure you're serving files through HTTP/HTTPS

**Preview not showing?**
- Click "Apply Data" before previewing
- Check that your JSON is valid
- Look for JavaScript errors in console

## License

This project is open source and available for personal and commercial use.

## Contributing

Feel free to:
- Add new templates
- Improve existing templates
- Enhance the template renderer
- Add new features
- Report bugs

## Future Enhancements

Potential features to add:
- More templates
- Theme customization (colors, fonts)
- Template preview thumbnails
- Export to HTML
- Multiple language support
- Auto-save functionality
- Cloud storage integration

## Contact

For questions or suggestions, please open an issue or submit a pull request.

---

Made with ❤️ for job seekers everywhere
