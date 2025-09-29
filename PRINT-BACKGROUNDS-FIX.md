# Quick Fix: Missing Background Colors in PDF

If your printed PDF is missing background colors (white sidebar, no colored elements), follow these steps:

## ✅ Solution: Enable Background Graphics

### Chrome / Edge
1. Click "Print Resume" button
2. In the print dialog, click "More settings"
3. **Check the box** for "Background graphics"
4. Select "Save as PDF" as destination
5. Click "Save"

### Firefox
1. Click "Print Resume" button
2. Click "More settings" or "Page Setup"
3. **Check the box** for "Print backgrounds (colors & images)"
4. Select "Save to PDF" as destination
5. Click "Save"

### Safari (Mac)
1. Click "Print Resume" button
2. In the print dialog, click "Show Details"
3. **Check the box** for "Print backgrounds"
4. Click "PDF" → "Save as PDF"
5. Click "Save"

## Why This Happens

Browsers disable background graphics by default when printing to save ink. Our templates include CSS code to force backgrounds:

```css
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
color-adjust: exact;
```

However, some browsers still respect the user's print settings over CSS, so you need to manually enable backgrounds.

## Alternative: Use Download PDF Instead

If you don't want to adjust print settings every time:

1. Use the **"Download PDF"** button instead
2. This method includes backgrounds automatically
3. Takes 10-15 seconds to generate
4. No browser settings needed

## Visual Checklist

Before printing, your browser dialog should show:
- ✅ Background graphics: **ON**
- ✅ Headers and footers: OFF (optional)
- ✅ Destination: Save as PDF
- ✅ Paper size: A4 or Letter
- ✅ Margins: Default or Minimum

## Still Having Issues?

If backgrounds still don't print:

1. **Try Download PDF method** - Always includes backgrounds
2. **Update your browser** - Older versions may not support CSS print-color-adjust
3. **Check TROUBLESHOOTING.md** - Detailed solutions for all issues
4. **Use Chrome/Edge** - Best support for print CSS

## One-Time Browser Settings

Some browsers allow you to set default print preferences:

### Chrome/Edge
1. Settings → Advanced → Print
2. Enable "Background graphics" by default
3. This applies to all future prints

### Firefox
1. about:config in address bar
2. Search for "print.print_bgcolor" and set to **true**
3. Search for "print.print_bgimages" and set to **true**
4. Backgrounds will now print by default

## Quick Test

To verify backgrounds are working:
1. Load sample data
2. Preview resume
3. Print resume
4. PDF should show:
   - Dark blue/gray sidebar
   - Colored profile circle
   - Colored tech tags
   - Colored skill items
   - All backgrounds present

If you see these, backgrounds are working! ✅
