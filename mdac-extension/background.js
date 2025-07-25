// Background script for the MDAC Form Filler extension
console.log('MDAC Form Filler background script loaded');

// Keep track of content script status
const contentScriptStatus = new Map();

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('MDAC Form Filler extension installed');
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  // Track content script ready status
  if (request.action === 'contentScriptReady') {
    if (sender.tab) {
      contentScriptStatus.set(sender.tab.id, {
        ready: true,
        url: request.url,
        timestamp: Date.now()
      });
      console.log(`Content script ready on tab ${sender.tab.id}: ${request.url}`);
    }
  }
  
  // Forward messages if needed
  if (request.action === 'log') {
    console.log('Content script log:', request.message);
  }
  
  sendResponse({ success: true });
  return true;
});

// Clean up content script status when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (contentScriptStatus.has(tabId)) {
    contentScriptStatus.delete(tabId);
    console.log(`Cleaned up content script status for tab ${tabId}`);
  }
});
