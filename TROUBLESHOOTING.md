# Troubleshooting Guide - Resume Generator

## PDF Generation Issues

### Issue: Empty or Blank PDF Downloaded

**Common Causes:**
1. Grid layout compatibility issues with html2pdf
2. Content not fully rendered before PDF generation
3. Browser security restrictions
4. CSS that doesn't translate to PDF

**Solutions:**

#### Solution 1: Use the Print Button (Recommended)
1. Click "Preview Resume" first to see your resume
2. Click "Print Resume" button instead of "Download PDF"
3. In the print dialog, select "Save as PDF" as the destination
4. This uses your browser's native PDF generation which is more reliable

#### Solution 2: Increase Wait Time
If you're comfortable with code, you can increase the rendering wait time:

Edit `js/resume-generator.js`, line ~108:
```javascript
// Change this:
await new Promise(resolve => setTimeout(resolve, 500));

// To this (longer wait):
await new Promise(resolve => setTimeout(resolve, 2000));
```

#### Solution 3: Use Browser Developer Tools
1. Open browser console (F12)
2. Try generating PDF again
3. Look for any error messages
4. Share error details if asking for help

#### Solution 4: Try Different Template
The two-column template (Template 1) is generally more PDF-friendly:
1. Select "Two-Column Layout" from template dropdown
2. Click "Apply Data"
3. Try generating PDF again

### Issue: PDF Generation Takes Too Long

**This is normal!** PDF generation can take 10-15 seconds depending on:
- Resume length
- Number of sections
- Browser performance
- System resources

**What to do:**
- Wait patiently for the download
- Don't click the button multiple times
- Check your downloads folder
- Use the Print button as alternative

### Issue: "Resume container not found" Error

**Cause:** Template structure doesn't match expected format

**Solution:**
1. Make sure you're using the provided templates
2. If you modified templates, ensure they have a `<div class="resume-container">` element
3. Reload the page and try again

### Issue: PDF Layout Looks Wrong

**Common Problems:**
- Text is cut off
- Sidebar background missing
- Spacing is wrong

**Solutions:**

1. **For Sidebar Template Issues:**
   - Some printers/PDF generators don't support CSS Grid well
   - Switch to Template 1 (Two-Column Layout)
   - Or use the Print button method

2. **For Both Templates:**
   - Reduce content length in some sections
   - Use shorter descriptions
   - Remove optional sections you don't need

3. **Manual Fix:**
   - Click "Print Resume"
   - Adjust print settings:
     - Paper size: A4 or Letter
     - Margins: Default or Custom
     - Background graphics: ON
   - Save as PDF

## Browser-Specific Issues

### Chrome/Edge
- Works best overall
- If issues, try Print button
- Clear cache if persistent problems

### Firefox
- Grid layouts sometimes problematic
- **Recommended:** Always use Print button for Firefox
- Or switch to Chrome for PDF generation

### Safari
- Similar to Firefox
- Print button method more reliable
- Make sure "Print Backgrounds" is enabled

## Using Print-to-PDF (Recommended Workaround)

This method works in ALL browsers:

1. Click "Print Resume" button
2. In print dialog:
   - **IMPORTANT:** Enable "Background graphics" option (if available)
   - **Chrome/Edge:** Check "Background graphics" in More settings
   - **Firefox:** Check "Print backgrounds" in Page Setup
   - **Safari:** Enable "Print backgrounds" in the print dialog
   - **Windows:** Select "Microsoft Print to PDF" or "Save as PDF"
   - **Mac:** Click "PDF" button, select "Save as PDF"
   - **Linux:** Select "Print to File" and choose PDF
3. Choose location and save

**Benefits:**
- More reliable
- Better quality
- Works in all browsers
- Respects all CSS including backgrounds

## Data/Format Issues

### Issue: Some Sections Not Showing

**Cause:** Missing or incorrect data structure

**Solution:**
1. Check your JSON structure matches the sample
2. Ensure all required fields are present:
   - `personalInfo` (required)
   - `summary` (required)
   - Other sections optional but should be empty arrays if not used

Example:
```json
{
  "personalInfo": { ... },
  "summary": "...",
  "experience": [],  // Empty array if no experience
  "projects": []     // Empty array if no projects
}
```

### Issue: Special Characters Display Wrong

**Cause:** Encoding issues

**Solution:**
1. Save JSON file as UTF-8
2. Ensure your editor uses UTF-8 encoding
3. Test with sample data first

## Integration Issues

### Chrome Extension Integration

If using in Chrome extension and PDF fails:

1. **Check manifest.json permissions:**
```json
{
  "permissions": ["downloads", "storage"]
}
```

2. **Content Security Policy:**
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

3. **Use Message Passing:**
Instead of direct PDF generation in content scripts, use:
```javascript
// In content script
chrome.runtime.sendMessage({action: 'generatePDF', data: resumeData});

// In background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generatePDF') {
    // Generate PDF here
  }
});
```

### Web App Integration

If using in a web app:

1. **CORS Issues:**
   - Serve templates from same domain
   - Or configure CORS headers properly

2. **Module Loading:**
   - Ensure scripts load in correct order:
     1. html2pdf.js
     2. template-renderer.js  
     3. resume-generator.js

3. **Async/Await Support:**
   - Ensure your build target supports async/await
   - Or use Babel to transpile

## Still Having Issues?

### Debug Mode

Add this to see what's happening:

```javascript
// In browser console after loading page
generator.currentTemplate;  // Check current template
generator.resumeData;       // Check loaded data
generator.generateHTML();   // Test HTML generation
```

### Create Minimal Test Case

1. Use sample data
2. Use unmodified template
3. Test in incognito/private mode
4. Try different browser

### Report Issue

If nothing works, provide:
1. Browser name and version
2. Template used (1 or 2)
3. Error messages from console (F12)
4. Steps to reproduce
5. Whether Print button works

## Best Practices to Avoid Issues

1. ✅ **Test with sample data first**
2. ✅ **Preview before generating PDF**
3. ✅ **Keep descriptions concise**
4. ✅ **Use Print button for reliability**
5. ✅ **Use Chrome/Edge for best results**
6. ❌ Don't modify template structure without testing
7. ❌ Don't use very long descriptions
8. ❌ Don't click generate multiple times
9. ❌ Don't use special CSS that doesn't print well

## Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| Empty PDF | Use Print button |
| Slow generation | Wait 10-15 seconds |
| Layout broken | Try Template 1 |
| Nothing works | Use Print button in Chrome |
| Console errors | Share errors for help |

## Alternative Solutions

### Option 1: Manual HTML Export
1. Click "Preview Resume"
2. Right-click preview → "Inspect Element"
3. Right-click `<html>` tag → "Copy" → "Copy outerHTML"
4. Paste into new HTML file
5. Open in browser and print to PDF

### Option 2: Online PDF Converter
1. Generate HTML using preview
2. Save HTML file
3. Use online HTML to PDF converter
4. Upload HTML file
5. Download PDF

### Option 3: Command Line (Advanced)
If you have Node.js and Puppeteer:

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');

async function generatePDF() {
  const html = fs.readFileSync('resume.html', 'utf8');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({
    path: 'resume.pdf',
    format: 'A4',
    printBackground: true
  });
  await browser.close();
}

generatePDF();
```

## Contact & Support

- Check README.md for documentation
- Review integration-examples.js for code examples
- Open browser console for error details
- Try print method as reliable fallback

Remember: The Print Resume button is the most reliable method across all browsers and situations!
