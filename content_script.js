// This script is only injected when the popup form is loaded
// (see popup.js), so we don't need to worry about waiting for page load

// Object to hold information about the current page
var pageInfo = {
    'title': document.title,
    'url': window.location.href,
    'summary': window.getSelection().toString()
};

// Send the information back to the extension
chrome.extension.sendMessage(pageInfo);