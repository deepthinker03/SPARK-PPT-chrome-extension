# Spark PPT Downloader

A powerful Chrome extension that allows you to download presentations from Slideshare and Scribd as PDF or PPT files with just one click!

## Features

🚀 **One-Click Download**: Download presentations directly from Slideshare and Scribd pages
📄 **Multiple Formats**: Support for both PDF and PPT downloads
🎨 **Beautiful UI**: Modern glassmorphism design with smooth animations
🔍 **Auto-Detection**: Automatically detects presentation pages
⚡ **Fast Processing**: Efficient screenshot-based extraction
📱 **Manual URL Input**: Enter URLs directly in the popup for remote downloading

## Installation

1. **Download the Extension**
   - Clone or download this repository
   - Unzip if necessary

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

3. **Start Using**
   - Visit any Slideshare or Scribd presentation
   - Look for the floating download button
   - Or click the extension icon in the toolbar

## How to Use

### Method 1: On-Page Button
1. Navigate to a Slideshare or Scribd presentation
2. You'll see a floating download button in the bottom-right corner
3. Click it and select your preferred format (PDF or PPT)
4. The download will start automatically

### Method 2: Extension Popup
1. Click the Spark PPT extension icon in your Chrome toolbar
2. Paste the presentation URL in the input field
3. Select PDF or PPT format
4. Click "Download Now"

## Supported Sites

- ✅ Slideshare.net
- ✅ Scribd.com

## Technical Details

### Technologies Used
- **Manifest V3** for Chrome extension architecture
- **html2canvas** for screenshot capture
- **jsPDF** for PDF generation
- **PptxGenJS** for PowerPoint file creation
- **Modern CSS** with glassmorphism effects

### How It Works
1. **Content Detection**: The extension detects when you're on a supported site
2. **Slide Extraction**: Uses advanced techniques to capture presentation slides
3. **Image Processing**: Converts slides to high-quality images
4. **File Generation**: Creates PDF or PPT files from the captured slides
5. **Auto Download**: Automatically downloads the file to your system

## Permissions Required

- `activeTab`: To access the current tab and extract content
- `scripting`: To inject content scripts for processing
- `downloads`: To save files to your computer
- `storage`: To remember your preferences

## Privacy & Security

- ✅ No data is sent to external servers
- ✅ All processing happens locally in your browser
- ✅ No tracking or analytics
- ✅ No access to your personal data

## Troubleshooting

### Extension Not Working?
1. Make sure you're on a supported site (Slideshare or Scribd)
2. Refresh the page and try again
3. Check that the extension is enabled in `chrome://extensions/`

### Download Failed?
1. Ensure the presentation is publicly accessible
2. Try refreshing the page first
3. Some premium content may be protected

### Poor Quality Images?
- The extension captures what's visible on screen
- For best results, ensure slides are fully loaded before downloading

## Credits

**Built by Owais Iqbal x Deep Thinker**

## License

This extension is for educational purposes. Please respect copyright laws and terms of service of the platforms you're downloading from.

## Changelog

### v1.0.0
- Initial release
- Support for Slideshare and Scribd
- PDF and PPT download options
- Modern glassmorphism UI
- Auto-detection of presentation pages