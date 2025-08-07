// Slideshare-specific extraction utilities
const SlideshareExtractor = {
    
    // Detect different Slideshare layouts
    detectLayout() {
        if (document.querySelector('.slideshow-container')) return 'new';
        if (document.querySelector('.slide_container')) return 'legacy';
        if (document.querySelector('.normal-slide')) return 'embedded';
        return 'unknown';
    },
    
    // Get presentation metadata
    getMetadata() {
        const title = this.getTitle();
        const author = this.getAuthor();
        const slideCount = this.getSlideCount();
        
        return { title, author, slideCount };
    },
    
    getTitle() {
        const selectors = [
            'h1.slideshow-title',
            '.slideshow-title h1',
            'h1[data-cy="slideshow-title"]',
            '.j-title-breadcrumb',
            'h1'
        ];
        
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        
        return 'slideshare-presentation';
    },
    
    getAuthor() {
        const selectors = [
            '.slideshow-author a',
            '.user-name',
            '[data-cy="slideshow-author"]',
            '.author-name'
        ];
        
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        
        return 'Unknown';
    },
    
    getSlideCount() {
        // Try to get from pagination or slide counter
        const counterSelectors = [
            '.slideshow-pagination .total',
            '.slide-counter',
            '[data-cy="slide-counter"]'
        ];
        
        for (let selector of counterSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                const match = element.textContent.match(/(\d+)/);
                if (match) return parseInt(match[1]);
            }
        }
        
        // Fallback: count slide elements
        const slides = this.getSlideElements();
        return slides.length;
    },
    
    // Get slide elements based on layout
    getSlideElements() {
        const layout = this.detectLayout();
        
        switch (layout) {
            case 'new':
                return document.querySelectorAll('.slide, .slideshow-slide, .slide-image');
            case 'legacy':
                return document.querySelectorAll('.slide_container .slide');
            case 'embedded':
                return document.querySelectorAll('.normal-slide, .slide');
            default:
                // Generic fallback
                return document.querySelectorAll(
                    '.slide, .slideshow-slide, .slide-image, .normal-slide, [data-slide]'
                );
        }
    },
    
    // Get slide images
    async getSlideImages() {
        const slides = this.getSlideElements();
        const images = [];
        
        for (let slide of slides) {
            // Try different image selectors
            let img = slide.querySelector('img');
            if (!img) {
                img = slide.querySelector('.slide-image img, .slide-content img');
            }
            
            if (img && this.isValidSlideImage(img)) {
                images.push(img);
            }
        }
        
        return images;
    },
    
    isValidSlideImage(img) {
        // Filter out thumbnails, avatars, and other non-slide images
        const src = img.src || '';
        const className = img.className || '';
        const alt = img.alt || '';
        
        // Skip small images (likely thumbnails)
        if (img.naturalWidth < 300 || img.naturalHeight < 200) {
            return false;
        }
        
        // Skip common non-slide images
        const skipPatterns = [
            'avatar', 'profile', 'logo', 'thumbnail', 'thumb',
            'icon', 'button', 'social', 'ad', 'advertisement'
        ];
        
        for (let pattern of skipPatterns) {
            if (src.includes(pattern) || className.includes(pattern) || alt.includes(pattern)) {
                return false;
            }
        }
        
        return true;
    },
    
    // Navigate through slides if needed
    async navigateSlides() {
        const nextButton = document.querySelector(
            '.slideshow-next, .next-slide, .slide-next, [data-cy="slide-next"]'
        );
        
        if (!nextButton) return false;
        
        // Click next button and wait for slide to load
        nextButton.click();
        await this.wait(1000);
        
        return true;
    },
    
    // Wait for slides to load
    async waitForSlides() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 20;
            
            const checkSlides = () => {
                const images = this.getSlideImages();
                
                if (images.length > 0 || attempts >= maxAttempts) {
                    resolve(images);
                } else {
                    attempts++;
                    setTimeout(checkSlides, 500);
                }
            };
            
            checkSlides();
        });
    },
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};