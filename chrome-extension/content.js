// Content script for Spark PPT Downloader
(function() {
    'use strict';
    
    let isExtracting = false;
    let downloadBtn = null;
    let optionsMenu = null;
    let progressBar = null;
    
    // Initialize the extension
    function init() {
        if (!isSupportedSite()) return;
        
        createUI();
        setupMessageListener();
        
        console.log('Spark PPT Downloader initialized');
    }
    
    function isSupportedSite() {
        return window.location.hostname.includes('slideshare.net') || 
               window.location.hostname.includes('scribd.com');
    }
    
    function createUI() {
        createDownloadButton();
        createProgressBar();
    }
    
    function createDownloadButton() {
        if (downloadBtn) return;
        
        downloadBtn = document.createElement('button');
        downloadBtn.className = 'spark-download-btn';
        downloadBtn.innerHTML = `
            <svg class="spark-btn-icon" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
            Download
        `;
        
        downloadBtn.addEventListener('click', showDownloadOptions);
        document.body.appendChild(downloadBtn);
    }
    
    function showDownloadOptions() {
        if (optionsMenu) {
            optionsMenu.remove();
            optionsMenu = null;
            return;
        }
        
        optionsMenu = document.createElement('div');
        optionsMenu.className = 'spark-download-options';
        optionsMenu.innerHTML = `
            <button class="spark-format-option" data-format="pdf">Download as PDF</button>
            <button class="spark-format-option" data-format="ppt">Download as PPT</button>
        `;
        
        document.body.appendChild(optionsMenu);
        
        // Add event listeners
        optionsMenu.querySelectorAll('.spark-format-option').forEach(btn => {
            btn.addEventListener('click', function() {
                const format = this.dataset.format;
                startExtraction(format);
                hideDownloadOptions();
            });
        });
        
        // Show with animation
        setTimeout(() => optionsMenu.classList.add('show'), 10);
        
        // Hide when clicking outside
        document.addEventListener('click', function(e) {
            if (!optionsMenu.contains(e.target) && e.target !== downloadBtn) {
                hideDownloadOptions();
            }
        });
    }
    
    function hideDownloadOptions() {
        if (optionsMenu) {
            optionsMenu.classList.remove('show');
            setTimeout(() => {
                if (optionsMenu) {
                    optionsMenu.remove();
                    optionsMenu = null;
                }
            }, 300);
        }
    }
    
    function createProgressBar() {
        progressBar = document.createElement('div');
        progressBar.className = 'spark-progress-bar';
        document.body.appendChild(progressBar);
    }
    
    function updateProgress(percentage) {
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
    }
    
    function showToast(message, type = '') {
        const toast = document.createElement('div');
        toast.className = `spark-status-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    function setupMessageListener() {
        window.addEventListener('message', function(event) {
            if (event.data.type === 'SPARK_DOWNLOAD') {
                startExtraction(event.data.format);
            }
        });
    }
    
    async function startExtraction(format) {
        if (isExtracting) return;
        
        isExtracting = true;
        downloadBtn.classList.add('loading');
        downloadBtn.textContent = 'Processing...';
        
        try {
            showToast(`Starting ${format.toUpperCase()} extraction...`);
            updateProgress(10);
            
            if (window.location.hostname.includes('slideshare.net')) {
                await extractSlideshare(format);
            } else if (window.location.hostname.includes('scribd.com')) {
                await extractScribd(format);
            }
            
        } catch (error) {
            console.error('Extraction error:', error);
            showToast('Extraction failed. Please try again.', 'error');
        } finally {
            isExtracting = false;
            downloadBtn.classList.remove('loading');
            downloadBtn.innerHTML = `
                <svg class="spark-btn-icon" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                </svg>
                Download
            `;
            updateProgress(0);
        }
    }
    
    async function extractSlideshare(format) {
        updateProgress(20);
        
        // Get presentation title
        const titleElement = document.querySelector('h1.slideshow-title, .slideshow-title h1, h1');
        const title = titleElement ? titleElement.textContent.trim() : 'slideshare-presentation';
        
        updateProgress(30);
        
        // Find slide images - multiple selectors for different Slideshare layouts
        const slideSelectors = [
            '.slide img',
            '.slide-image img',
            '.normal-slide img',
            'img[data-slide]',
            '.slide-container img',
            '.slideshow-slide img'
        ];
        
        let slideImages = [];
        for (let selector of slideSelectors) {
            slideImages = document.querySelectorAll(selector);
            if (slideImages.length > 0) break;
        }
        
        if (slideImages.length === 0) {
            // Fallback: screenshot method
            await screenshotMethod(title, format);
            return;
        }
        
        updateProgress(40);
        
        // Extract slides
        const slides = [];
        let processed = 0;
        
        for (let img of slideImages) {
            try {
                const canvas = await captureElement(img);
                if (canvas) {
                    slides.push(canvas);
                }
            } catch (error) {
                console.warn('Failed to capture slide:', error);
            }
            
            processed++;
            updateProgress(40 + (processed / slideImages.length) * 40);
        }
        
        updateProgress(80);
        
        if (slides.length === 0) {
            throw new Error('No slides captured');
        }
        
        // Generate file
        if (format === 'pdf') {
            await generatePDF(slides, title);
        } else {
            await generatePPT(slides, title);
        }
        
        updateProgress(100);
        showToast(`Successfully downloaded ${slides.length} slides as ${format.toUpperCase()}!`, 'success');
    }
    
    async function extractScribd(format) {
        updateProgress(20);
        
        // Get document title
        const titleElement = document.querySelector('h1, .title, .document_title, [data-testid="document_title"]');
        const title = titleElement ? titleElement.textContent.trim() : 'scribd-document';
        
        updateProgress(30);
        
        // Scribd uses different methods - try screenshot approach
        await screenshotMethod(title, format);
    }
    
    async function screenshotMethod(title, format) {
        updateProgress(40);
        
        // Scroll to capture full content
        const originalY = window.scrollY;
        const body = document.body;
        const html = document.documentElement;
        
        const height = Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        
        window.scrollTo(0, 0);
        await wait(1000);
        
        updateProgress(60);
        
        // Capture screenshot
        const canvas = await window.html2canvas(document.body, {
            height: height,
            width: window.innerWidth,
            useCORS: true,
            scale: 2,
            logging: false
        });
        
        updateProgress(80);
        
        // Generate file
        if (format === 'pdf') {
            await generatePDF([canvas], title);
        } else {
            await generatePPT([canvas], title);
        }
        
        // Restore scroll position
        window.scrollTo(0, originalY);
        
        updateProgress(100);
        showToast(`Successfully downloaded as ${format.toUpperCase()}!`, 'success');
    }
    
    async function captureElement(element) {
        return new Promise((resolve) => {
            try {
                html2canvas(element, {
                    useCORS: true,
                    scale: 2,
                    logging: false
                }).then(resolve).catch(() => resolve(null));
            } catch (error) {
                resolve(null);
            }
        });
    }
    
    async function generatePDF(slides, title) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: slides[0].width > slides[0].height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [slides[0].width, slides[0].height]
        });
        
        for (let i = 0; i < slides.length; i++) {
            if (i > 0) pdf.addPage();
            
            const imgData = slides[i].toDataURL('image/jpeg', 0.95);
            pdf.addImage(imgData, 'JPEG', 0, 0, slides[i].width, slides[i].height);
        }
        
        pdf.save(`${sanitizeFileName(title)}.pdf`);
    }
    
    async function generatePPT(slides, title) {
        const pres = new PptxGenJS();
        
        for (let slide of slides) {
            const pptSlide = pres.addSlide();
            const imgData = slide.toDataURL('image/jpeg', 0.95);
            
            pptSlide.addImage({
                data: imgData,
                x: 0,
                y: 0,
                w: '100%',
                h: '100%'
            });
        }
        
        await pres.writeFile(`${sanitizeFileName(title)}.pptx`);
    }
    
    function sanitizeFileName(fileName) {
        return fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
    }
    
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();