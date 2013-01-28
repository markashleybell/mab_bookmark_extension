// Object to hold information about the current page
var pageInfo = {
    "title": document.title,
    "url": window.location.href,
    "summary": window.getSelection().toString()
};

// Send the information back to the extension
chrome.extension.sendRequest(pageInfo);