// This callback function is called when the content script has been 
// injected and returned its results
function onPageInfo(o)  { 

    document.getElementById('title').value = o.title; 
    document.getElementById('url').value = o.url; 
    document.getElementById('abstract').innerText = o.abstract; 

} 

// Global reference to the status display SPAN
var statusDisplay = null;

// POST the data to the server using XMLHttpRequest
function addBookmark() {

    // Cancel the form submit
    event.preventDefault();

    // The URL to POST our data to
    var postUrl = 'http://post-test.markb.com';

    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    
    var params = 'link_id=0' + 
                 '&title=' + encodeURIComponent(document.getElementById('title').value) + 
                 '&url=' + encodeURIComponent(document.getElementById('url').value) + 
                 '&abstract=' + encodeURIComponent(document.getElementById('abstract').value) +
                 '&tags=' + encodeURIComponent(document.getElementById('tags').value);
    
    // Replace any instances of the URLEncoded space char with +
    params = params.replace(/%20/g, '+');

    // Set correct header for form data 
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Handle request state change events
    xhr.onreadystatechange = function() { 
        // If the request completed
        if (xhr.readyState == 4) {
            statusDisplay.innerHTML = '';
            if (xhr.status == 200) {
                // If it was a success, close the popup after a short delay
                statusDisplay.innerHTML = 'Saved!';
                window.setTimeout(window.close, 1000);
            } else {// Show what went wrong
                statusDisplay.innerHTML = 'Error saving: ' + xhr.statusText;
            }
        }
    };

    // Send the request and set status
    xhr.send(params);
    statusDisplay.innerHTML = 'Saving...';

}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {

    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);
    // Call the getPageInfo function in the background page, injecting content_script.js 
    // into the current HTML page and passing in our onPageInfo function as the callback
    chrome.extension.getBackgroundPage().getPageInfo(onPageInfo);

});