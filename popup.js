// The URL to POST our data to
const postUrl = 'http://post-test.local.com';

// Global reference to the status display SPAN
let statusDisplay = null;

// POST the data to the server using XMLHttpRequest
function addBookmark(e) {
    // Cancel the form submit
    e.preventDefault();
    
    // Set up an asynchronous AJAX POST request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    
    // Prepare the data to be POSTed by URLEncoding each field's contents
    const title = encodeURIComponent(document.getElementById('title').value);
    const url = encodeURIComponent(document.getElementById('url').value);
    const summary = encodeURIComponent(document.getElementById('summary').value);
    const tags = encodeURIComponent(document.getElementById('tags').value);
    
    const parameters = `title=${title}&url=${url}&summary=${summary}&tags=${tags}`;

    // Set correct header for form data 
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Handle request state change events
    xhr.onreadystatechange = () => { 
        // If the request completed
        if (xhr.readyState == 4) {
            statusDisplay.innerHTML = '';
            if (xhr.status == 200) {
                // If it was a success, close the popup after a short delay
                statusDisplay.innerHTML = 'Saved!';
                window.setTimeout(window.close, 1000);
            } else {
                // Show what went wrong
                const errorDetails = xhr.statusText || xhr.responseText || `no response from ${postUrl}`;
                statusDisplay.innerHTML = `Error: ${errorDetails}`;
            }
        }
    };

    // Send the request and set status
    xhr.send(parameters);
    statusDisplay.innerHTML = 'Saving...';
}

// When the popup HTML has loaded
window.addEventListener('load', e => {
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);
    // Listen for a message from the content script we're about to inject
    chrome.runtime.onMessage.addListener(message => { 
        document.getElementById('title').value = message.title; 
        document.getElementById('url').value = message.url; 
        document.getElementById('summary').innerText = message.summary; 
    }); 
    // Inject the content script that gets the page details
    chrome.tabs.executeScript({file: 'pagedetails.js'});
});