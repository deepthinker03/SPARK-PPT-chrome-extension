# 🔍 PRE-INSTALLATION CHECKLIST

**Before loading the extension, verify these items:**

## ✅ File Structure Check (ROOT DIRECTORY)
- [ ] `manifest.json` exists in the ROOT folder (not in any subfolder)
- [ ] `popup.html`, `popup.js`, `popup.css` are in ROOT folder
- [ ] `content.js`, `content.css`, `background.js` are in ROOT folder
- [ ] `icons/` folder contains: icon16.png, icon32.png, icon48.png, icon128.png
- [ ] `libs/` folder contains: html2canvas.min.js, jspdf.min.js, pptxgen.min.js
- [ ] `utils/` folder contains: slideshare.js, scribd.js

## ✅ JSON Validation
- [ ] Run this command to validate manifest.json:
```bash
python -c "import json; json.load(open('manifest.json')); print('Valid JSON')"
```

## ✅ Installation Steps
1. [ ] Open Chrome: `chrome://extensions/`
2. [ ] Enable "Developer mode" (top-right toggle)
3. [ ] Click "Load unpacked" button
4. [ ] Select the ROOT FOLDER containing `manifest.json` directly
5. [ ] Verify extension appears without errors

## ✅ Test the Extension
1. [ ] Extension icon appears in toolbar
2. [ ] Click icon to open popup interface
3. [ ] Visit slideshare.net or scribd.com
4. [ ] Floating download button should appear
5. [ ] Test download functionality

---

## 🚨 Common Error Solutions

**"Manifest file is missing"**
- Make sure you're selecting the ROOT project folder
- The selected folder must contain `manifest.json` at the top level
- Do NOT select any subfolders like `chrome-extension/`

**"Could not load manifest"**
- Check JSON syntax using the validation command above
- Ensure file encoding is UTF-8

**Extension doesn't work**
- Refresh the webpage after installation
- Check Chrome console for errors (F12 > Console)

---

## 📁 CORRECT FILE STRUCTURE (ROOT LEVEL)

```
your-project-folder/          ← SELECT THIS FOLDER
├── manifest.json             ← AT ROOT LEVEL
├── popup.html
├── popup.js
├── popup.css
├── content.js
├── content.css
├── background.js
├── INSTALL.txt
├── README.md
├── CHECKLIST.md
├── demo.html
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
├── libs/
│   ├── html2canvas.min.js
│   ├── jspdf.min.js
│   └── pptxgen.min.js
└── utils/
    ├── slideshare.js
    └── scribd.js
```

---

**All files are now accessible from the main root directory! Ready to install? Follow the INSTALL.txt guide!**