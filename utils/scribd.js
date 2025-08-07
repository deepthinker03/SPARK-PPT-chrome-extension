// Scribd-specific extraction utilities
const ScribdExtractor = {
    
    // Get document metadata
    getMetadata() {
        const title = this.getTitle();
        const author = this.getAuthor();
        const pageCount = this.getPageCount();
        
        return { title, author, pageCount };
    },
    
    getTitle() {
        const selectors = [
            'h1[data-testid="document_title"]',
            '.document_title h1',
            'h1.title',
            '.doc_title',
            'h1'
        ];
        
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        
        return 'scribd-document';
    },
    
    getAuthor() {
        const selectors = [
            '[data-testid="document_author"] a',
            '.document_author',
            '.author_name',
            '.doc_author a'
        ];
        
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        
        return 'Unknown';
    },
    
    getPageCount() {
        // Try to get page count from various selectors
        const selectors = [
            '[data-testid="page_count"]',
            '.page_count',
            '.total_pages',
            '.page-counter'
        ];
        
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                const match = element.textContent.match(/(\d+)/);
                if (match) return parseInt(match[1]);
            }
        }
        
        return null;
    },
    
    // Try to extract document content
    async extractContent() {
        // Method 1: Try to find document pages
        const pages = await this.getDocumentPages();
        if (pages.length > 0) {
            return await this.capturePages(pages);
        }
        
        // Method 2: Full page screenshot
        return await this.fullPageScreenshot();
    },
    
    async getDocumentPages() {
        const pageSelectors = [
            '.text_layer',
            '.page',
            '.document_page',
            '[data-testid="page"]',
            '.scribd_page'
        ];
        
        for (let selector of pageSelectors) {
            const pages = document.querySelectorAll(selector);
            if (pages.length > 0) {
                return Array.from(pages);
            }
        }
        
        return [];
    },
    
    async capturePages(pages) {
        const captures = [];
        
        for (let i = 0; i < pages.length; i++) {
            try {
                // Scroll page into view
                pages[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                await this.wait(500);
                
                // Capture the page
                const canvas = await html2canvas(pages[i], {
                    useCORS: true,
                    scale: 2,
                    logging: false,
                    backgroundColor: '#ffffff'
                });
                
                captures.push(canvas);
            } catch (error) {
                console.warn(`Failed to capture page ${i + 1}:`, error);
            }
        }
        
        return captures;
    },
    
    async fullPageScreenshot() {
        // Scroll to top first
        window.scrollTo(0, 0);
        await this.wait(1000);
        
        // Get document dimensions
        const body = document.body;
        const html = document.documentElement;
        
        const height = Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        
        // Capture full page
        const canvas = await html2canvas(document.body, {
            height: height,
            width: window.innerWidth,
            useCORS: true,
            scale: 1.5,
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        return [canvas];
    },
    
    // Handle premium content limitations
    async handlePremiumContent() {
        // Check if content is behind paywall
        const premiumIndicators = [
            '.premium_banner',
            '.paywall',
            '.subscription_required',
            '[data-testid="premium_content"]'
        ];
        
        for (let selector of premiumIndicators) {
            if (document.querySelector(selector)) {
                throw new Error('Premium content detected. Full access may be required.');
            }
        }
    },
    
    // Attempt to expand content
    async expandContent() {
        // Try to click "Read More" or "Show Full Document" buttons
        const expandButtons = document.querySelectorAll(
            '.expand_document, .read_more, .show_full_document, [data-testid="expand_content"]'
        );
        
        for (let button of expandButtons) {
            try {
                button.click();
                await this.wait(1000);
            } catch (error) {
                console.warn('Could not expand content:', error);
            }
        }
    },
    
    // Auto-scroll to load lazy content
    async autoScroll() {
        const totalHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;
        let currentPosition = 0;
        
        while (currentPosition < totalHeight) {
            window.scrollTo(0, currentPosition);
            await this.wait(300);
            currentPosition += viewportHeight * 0.8;
        }
        
        // Scroll back to top
        window.scrollTo(0, 0);
        await this.wait(500);
    },
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};