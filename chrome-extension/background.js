// Background script for Spark PPT Downloader
chrome.runtime.onInstalled.addListener(() => {
    console.log('Spark PPT Downloader installed');
    
    // Set default settings
    chrome.storage.local.set({
        defaultFormat: 'pdf',
        autoDetect: true,
        downloadPath: '',
        lastUrl: ''
    });
});

// Handle context menu (optional future feature)
chrome.contextMenus?.create({
    id: "spark-download",
    title: "Download with Spark PPT",
    contexts: ["page"],
    documentUrlPatterns: [
        "https://*.slideshare.net/*",
        "https://*.scribd.com/*"
    ]
});

// Handle context menu clicks
chrome.contextMenus?.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "spark-download") {
        // Inject and run content script
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                window.postMessage({
                    type: 'SPARK_DOWNLOAD',
                    format: 'pdf'
                }, '*');
            }
        });
    }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'DOWNLOAD_PROGRESS') {
        // Handle download progress updates
        chrome.action.setBadgeText({
            text: message.progress + '%',
            tabId: sender.tab.id
        });
        
        chrome.action.setBadgeBackgroundColor({
            color: '#4f46e5',
            tabId: sender.tab.id
        });
        
        if (message.progress === 100) {
            setTimeout(() => {
                chrome.action.setBadgeText({
                    text: '',
                    tabId: sender.tab.id
                });
            }, 2000);
        }
    }
    
    if (message.type === 'DOWNLOAD_COMPLETE') {
        // Show notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Spark PPT Downloader',
            message: `Successfully downloaded: ${message.filename}`
        });
    }
    
    if (message.type === 'DOWNLOAD_ERROR') {
        // Show error notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Spark PPT Downloader - Error',
            message: message.error || 'Download failed'
        });
    }
    
    return true;
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const isSupportedSite = tab.url.includes('slideshare.net') || tab.url.includes('scribd.com');
        
        if (isSupportedSite) {
            // Update badge to show extension is available
            chrome.action.setBadgeText({
                text: '●',
                tabId: tabId
            });
            
            chrome.action.setBadgeBackgroundColor({
                color: '#10b981',
                tabId: tabId
            });
        } else {
            chrome.action.setBadgeText({
                text: '',
                tabId: tabId
            });
        }
    }
});

// Handle download permissions
chrome.downloads.onCreated.addListener((downloadItem) => {
    if (downloadItem.filename && (downloadItem.filename.includes('.pdf') || downloadItem.filename.includes('.pptx'))) {
        console.log('Spark download started:', downloadItem.filename);
    }
});

chrome.downloads.onChanged.addListener((delta) => {
    if (delta.state && delta.state.current === 'complete') {
        console.log('Spark download completed');
    }
});