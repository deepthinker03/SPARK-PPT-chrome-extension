# 🔍 PRE-INSTALLATION CHECKLIST

**Before loading the extension, verify these items:**

## ✅ File Structure Check
- [ ] `manifest.json` exists in the main folder
- [ ] `popup.html`, `popup.js`, `popup.css` are present
- [ ] `content.js`, `content.css`, `background.js` are present
- [ ] `icons/` folder contains: icon16.png, icon32.png, icon48.png, icon128.png
- [ ] `libs/` folder contains: html2canvas.min.js, jspdf.min.js, pptxgen.min.js

## ✅ JSON Validation
- [ ] Run this command to validate manifest.json:
```bash
python -c "import json; json.load(open('manifest.json')); print('Valid JSON')"
```

## ✅ Installation Steps
1. [ ] Open Chrome: `chrome://extensions/`
2. [ ] Enable "Developer mode" (top-right toggle)
3. [ ] Click "Load unpacked" button
4. [ ] Select the folder containing `manifest.json`
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
- Make sure you're selecting the correct folder
- The selected folder must contain `manifest.json` directly

**"Could not load manifest"**
- Check JSON syntax using the validation command above
- Ensure file encoding is UTF-8

**Extension doesn't work**
- Refresh the webpage after installation
- Check Chrome console for errors (F12 > Console)

---

**Ready to install? Follow the INSTALL.txt guide!**