document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('url-input');
    const downloadBtn = document.getElementById('download-btn');
    const statusDiv = document.getElementById('status');
    const formatButtons = document.querySelectorAll('.format-btn');
    const spinner = document.querySelector('.spinner');
    const btnText = document.querySelector('.btn-text');
    
    let selectedFormat = 'pdf';
    
    // Format selector functionality
    formatButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            formatButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedFormat = this.dataset.format;
        });
    });
    
    // Load saved URL if exists
    chrome.storage.local.get(['lastUrl'], function(result) {
        if (result.lastUrl) {
            urlInput.value = result.lastUrl;
        }
    });
    
    // Check if current tab is supported site
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentUrl = tabs[0].url;
        if (currentUrl && (currentUrl.includes('slideshare.net') || currentUrl.includes('scribd.com'))) {
            urlInput.value = currentUrl;
            statusDiv.textContent = 'Current page detected ✓';
            statusDiv.className = 'status success';
        }
    });
    
    downloadBtn.addEventListener('click', async function() {
        const url = urlInput.value.trim();
        
        if (!url) {
            showStatus('Please enter a URL', 'error');
            return;
        }
        
        if (!isValidUrl(url)) {
            showStatus('Please enter a valid Slideshare or Scribd URL', 'error');
            return;
        }
        
        // Save URL
        chrome.storage.local.set({lastUrl: url});
        
        // Start download process
        startDownload(url, selectedFormat);
    });
    
    function isValidUrl(url) {
        return url.includes('slideshare.net') || url.includes('scribd.com');
    }
    
    function showStatus(message, type = '') {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
    }
    
    function setLoading(loading) {
        downloadBtn.disabled = loading;
        if (loading) {
            spinner.classList.remove('hidden');
            btnText.textContent = 'Processing...';
        } else {
            spinner.classList.add('hidden');
            btnText.textContent = 'Download Now';
        }
    }
    
    async function startDownload(url, format) {
        setLoading(true);
        showStatus('Initializing download...', '');
        
        try {
            // Check if we need to open a new tab or use current tab
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            const currentUrl = tabs[0].url;
            
            if (currentUrl !== url) {
                // Open new tab with the URL
                const newTab = await chrome.tabs.create({url: url, active: false});
                
                // Wait for tab to load
                await new Promise(resolve => {
                    const listener = function(tabId, changeInfo) {
                        if (tabId === newTab.id && changeInfo.status === 'complete') {
                            chrome.tabs.onUpdated.removeListener(listener);
                            resolve();
                        }
                    };
                    chrome.tabs.onUpdated.addListener(listener);
                });
                
                // Start extraction
                await chrome.scripting.executeScript({
                    target: {tabId: newTab.id},
                    function: extractPresentation,
                    args: [format]
                });
                
                // Close the tab after extraction
                chrome.tabs.remove(newTab.id);
            } else {
                // Use current tab
                await chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    function: extractPresentation,
                    args: [format]
                });
            }
            
            showStatus(`Successfully downloaded as ${format.toUpperCase()}!`, 'success');
            
        } catch (error) {
            console.error('Download error:', error);
            showStatus('Download failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    }
    
    // This function will be injected into the page
    function extractPresentation(format) {
        // This will be handled by content script
        window.postMessage({
            type: 'SPARK_DOWNLOAD',
            format: format
        }, '*');
    }
});